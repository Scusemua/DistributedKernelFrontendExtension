import { ISessionContext } from '@jupyterlab/apputils';

import { KernelMessage } from '@jupyterlab/services';

import { IShellFuture } from '@jupyterlab/services/lib/kernel/kernel';

import {
  IExecuteReplyMsg,
  IExecuteRequestMsg
} from '@jupyterlab/services/lib/kernel/messages';

import { ISignal, Signal } from '@lumino/signaling';

/**
 * Class that handles code execution requests. We use this to run some code to set some state when the notebook/kernel starts.
 */
export class KernelCodeExecutor {
  private _associatedSession: ISessionContext;
  private _kernelRestartedSignal = new Signal<this, Promise<void>>(this);

  constructor(options: KernelCodeExecutor.IOptions) {
    this._associatedSession = options.session;
    this._associatedSession.statusChanged.connect(
      (sender: ISessionContext, newStatus: KernelMessage.Status) => {
        switch (newStatus) {
          case 'restarting':
          case 'autorestarting':
            this._kernelRestartedSignal.emit(this._associatedSession.ready);
            break;
          default:
            break;
        }
      }
    );
  }

  get kernelRestarted(): ISignal<KernelCodeExecutor, Promise<void>> {
    return this._kernelRestartedSignal;
  }

  get kernelName(): string {
    return this._associatedSession.kernelDisplayName;
  }

  /**
   *  A Promise that is fulfilled when the session associated with the KernelCodeExecutor is ready.
   */
  get ready(): Promise<void> {
    return this._associatedSession.ready;
  }

  /**
   *  The signal emitted when IOPub messages of the associated kernel are emitted. 
   */
  get iopubMessage(): ISignal<ISessionContext, KernelMessage.IMessage> {
    return this._associatedSession.iopubMessage;
  }

  /**
   * Executes the given request on the kernel associated with the KernelCodeExecutor.
   * @param content: the IExecuteRequestMsg to forward to the kernel.
   * @param ioCallback: A callable to which IOPub messages of the kernel are forwarded.
   * @returns Promise<KernelMessage.IExecuteReplyMsg>
   */
  fetch(
    content: KernelMessage.IExecuteRequestMsg["content"],
    ioCallback: (msg: KernelMessage.IIOPubMessage) => any
  ): Promise<KernelMessage.IExecuteReplyMsg> {
    const kernel = this._associatedSession.session?.kernel;
    if (kernel == null) {
      return Promise.reject(new Error("There is no kernel available. Cannot execute code."));
    }

    const future = kernel.requestExecute(content);

    future.onIOPub = (msg: KernelMessage.IIOPubMessage): void => { ioCallback(msg); };
    return future.done as Promise<KernelMessage.IExecuteReplyMsg>;
  }

  execute(content: KernelMessage.IExecuteRequestMsg["content"]): IShellFuture<IExecuteRequestMsg, IExecuteReplyMsg> {
    const kernel = this._associatedSession.session?.kernel;
    if (kernel == null) {
      throw new Error("There is no session available. Cannot execute code.");
    }
    return kernel.requestExecute(content);
  }
}

export namespace KernelCodeExecutor {
  export interface IOptions {
    session: ISessionContext;
  }
}