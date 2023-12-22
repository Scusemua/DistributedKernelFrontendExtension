import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { INotebookTracker, NotebookPanel, INotebookModel } from '@jupyterlab/notebook';

import { KernelConnector } from './kernel_connector';

import { v4 as uuidv4 } from 'uuid';

// import { INotebookTracker, INotebookModel , NotebookPanel } from '@jupyterlab/notebook';
// import { ISessionContext } from '@jupyterlab/apputils';
// import { Cell, CodeCell, CodeCellModel } from '@jupyterlab/cells';
// import { RenderMimeRegistry } from '@jupyterlab/rendermime';
// import { CodeMirrorEditorFactory } from '@jupyterlab/codemirror';

/**
 * Initialization data for the jupyterlab_apod extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'jupyterlab_apod:plugin',
  requires: [INotebookTracker],
  description: 'Provides an ID that is associated with a given IPYNB file. This enables the restoration of runtime states when the associated notebook is opened.',
  autoStart: true,
  activate: activate,
};

function activate(app: JupyterFrontEnd, notebooks: INotebookTracker): void {
  console.log('JupyterLab extension jupyterlab_apod v0.1.3 is activated!');

  notebooks.widgetAdded.connect((sender, nbPanel: NotebookPanel) => {
    console.log("Jupyter Notebook widget changed!")

    const session = nbPanel.sessionContext;
    const connector = new KernelConnector({ session });

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

            console.log("Will be executing the following code:\n", codeToExecute);
          }
        }
      }
    )
  });
}

export default plugin;
