import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { INotebookTracker, NotebookPanel, INotebookModel } from '@jupyterlab/notebook';

import { KernelCodeExecutor } from './kernel_code_executor';

import { v4 as uuidv4 } from 'uuid';

// import { INotebookTracker, INotebookModel , NotebookPanel } from '@jupyterlab/notebook';
// import { ISessionContext } from '@jupyterlab/apputils';
// import { Cell, CodeCell, CodeCellModel } from '@jupyterlab/cells';
// import { RenderMimeRegistry } from '@jupyterlab/rendermime';
// import { CodeMirrorEditorFactory } from '@jupyterlab/codemirror';

/**
 * Initialization data for the distributed_kernel_persistent_id extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'distributed_kernel_persistent_id:plugin',
  requires: [INotebookTracker],
  description: 'Provides an ID that is associated with a given IPYNB file. This enables the restoration of runtime states when the associated notebook is opened.',
  autoStart: true,
  activate: activate,
};

function activate(app: JupyterFrontEnd, notebooks: INotebookTracker): void {
  console.log('JupyterLab extension distributed_kernel_persistent_id v0.1.7 is activated!');

  notebooks.widgetAdded.connect((sender, nbPanel: NotebookPanel) => {
    console.log("Jupyter Notebook widget changed!")

    const session = nbPanel.sessionContext;
    const connector = new KernelCodeExecutor({ session });
    
    connector.ready.then(
      async () => {
        console.log("Notebook Kernel is ready!");

        // Access the notebook model
        const notebookModel: INotebookModel | null = nbPanel.content?.model;

        if (notebookModel != null) {
          if (notebookModel.getMetadata('persistent_id') == null) {
            notebookModel.setMetadata('persistent_id', uuidv4())
      
            console.log('Updated Notebook Metadata:', notebookModel.metadata);

            let codeToExecute:string  = "persistent_id=\"" + notebookModel.getMetadata('persistent_id') + "\""
            if (notebookModel.getMetadata("replica_id") != null) {
              codeToExecute += "\nreplica_id=\"" + notebookModel.getMetadata("replica_id") + "\""
            }

            console.log("Saving notebook now.");

            app.commands.execute('docmanager:save', {
              path: notebooks.currentWidget?.context.path
            });

            console.log("Notebook saved. Will be executing the following code:\n", codeToExecute);
            var future = connector.execute({ code: codeToExecute});
            console.log("Requested code execution. Waiting for result now.");

            future.onIOPub  = (msg) => {
              const msgType = msg.header.msg_type;
              switch (msgType) {
                case 'execute_result':
                  var result = msg.content;
                  console.log("execute_result result:\n", result);       
                  break;
                case 'display_data':
                  var result = msg.content;
                  console.log("display_data result:\n", result);       
                  break;
                case 'update_display_data':
                  var result = msg.content;
                  console.log("update_display_data result:\n", result);       
                  break;
                default:
                  var result = msg.content;
                  console.log("default-case result:\n", result);   
                  break;
              }
            }
          }
        }
      }
    )
  });
}

export default plugin;
