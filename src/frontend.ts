// import { JupyterFrontEnd, JupyterFrontEndPlugin } from '@jupyterlab/application';
// import { INotebookTracker } from '@jupyterlab/notebook';
// import { INotebookTracker, INotebookModel , NotebookPanel } from '@jupyterlab/notebook';
// import { ISessionContext } from '@jupyterlab/apputils';
// import { Cell, CodeCell, CodeCellModel } from '@jupyterlab/cells';
// import { RenderMimeRegistry } from '@jupyterlab/rendermime';
// import { CodeMirrorEditorFactory } from '@jupyterlab/codemirror';

// // import { v4 as uuidv4 } from 'uuid';

// /**
//  * Initialization data for the distributedKernel extension.
//  */
// const plugin: JupyterFrontEndPlugin<void> = {
//   id: 'distributedKernel:plugin',
//   description: 'Provides an ID that is associated with a given IPYNB file. This enables the restoration of runtime states when the associated notebook is opened.',
//   autoStart: true,
//   activate: activate
// };

// function activate(
//   app: JupyterFrontEnd,
//   notebooks: INotebookTracker
// ): void {

  // Do something when the notebook is added
//   notebooks.widgetAdded.connect((sender: INotebookTracker, widget: NotebookPanel) => {
//     // Access the notebook model
//     const notebookModel: INotebookModel | null = widget.content?.model;

//     if (notebookModel != null) {
//       if (notebookModel.getMetadata('persistent_id') == null) {
//         notebookModel.setMetadata('persistent_id', uuidv4())
  
//         console.log('Updated Notebook Metadata:', notebookModel.metadata);

//         let codeToExecute:string  = "persistent_id=\"" + notebookModel.getMetadata('persistent_id') + "\""
//         if (notebookModel.getMetadata("replica_id") != null) {
//           codeToExecute += "\nreplica_id=\"" + notebookModel.getMetadata("replica_id") + "\""
//         }

//         executePythonCode(codeToExecute, widget.sessionContext)
//           .catch(error => console.error('Error executing code:', error));
//       } else {
//         console.log("Notebook already has persistent_id: ", notebookModel.getMetadata('persistent_id'))
//       }
//     }
//   });
// }

// // function executePythonCode(
// //   code: string,
// //   sessionContext: ISessionContext
// // ): Promise<void> {
// //   const kernel = sessionContext.session?.kernel;

// //   if (kernel) {
// //     // Create a new code cell model with the provided code
// //     const cellModel = new CodeCellModel({});

// //     // Set the code for the cell model
// //     cellModel.sharedModel.setSource(code);

// //     const factoryService = new CodeMirrorEditorFactory({});

// //     // Create a new code cell with the cell model
// //     const codeCell = new CodeCell({ 
// //       contentFactory: new Cell.ContentFactory({
// //         editorFactory: factoryService.newInlineEditor.bind(factoryService)
// //       }),
// //       model: cellModel, 
// //       rendermime: new RenderMimeRegistry({})
// //     });

// //     // Execute the code cell in the notebook's kernel
// //     return CodeCell.execute(codeCell, sessionContext).then(() => {
// //       // Handle the execution completion if needed
// //       console.log('Code execution completed.');
// //     });
// //   } else {
// //     return Promise.reject('Kernel not available.');
// //   }
// // }

// export default plugin;
