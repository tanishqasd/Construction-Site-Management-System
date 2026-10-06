import { Component, type ErrorInfo, type ReactNode } from 'react';
export class ErrorBoundary extends Component<{children:ReactNode},{failed:boolean}> {
  state={failed:false};
  static getDerivedStateFromError(){return {failed:true};}
  componentDidCatch(_error:Error,_info:ErrorInfo){ /* Show recovery without exposing account or record details. */ }
  render(){
    if(this.state.failed)return <main className="flex min-h-screen items-center justify-center bg-ink-50 p-6"><section role="alert" className="workspace-card max-w-md p-7"><h1 className="text-xl font-semibold">Something went wrong</h1><p className="my-4 text-sm leading-6 text-ink-500">Reload your workspace to recover. If this continues, contact your site administrator.</p><button className="primary-button" onClick={()=>window.location.reload()}>Reload workspace</button><a className="secondary-button ml-3" href="/login">Sign in</a></section></main>;
    return this.props.children;
  }
}
