import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, UserRound, LockKeyhole, Loader2 } from 'lucide-react';
import { useAuth, type User } from '../context/AuthContext';
import { useWorkspace } from '../context/WorkspaceContext';
import { apiRequest } from '../services/api';
import { Card, PageIntro } from '../components/WorkspaceUI';
import { roleLabels, roleModules } from '../utils/permissions';
export function AccountPage() {
  const { user, updateUser, logout, isDemo }=useAuth(); const { role }=useWorkspace(); const navigate=useNavigate();
  const [name,setName]=useState(user?.name||''); const [currentPassword,setCurrentPassword]=useState(''); const [password,setPassword]=useState(''); const [confirmation,setConfirmation]=useState('');
  const [message,setMessage]=useState(''); const [error,setError]=useState(''); const [busy,setBusy]=useState('');
  const profile=async(event:FormEvent)=>{
    event.preventDefault();setBusy('profile');setError('');setMessage('');
    try { const result=await apiRequest<{user:User}>('/user/profile',{method:'PUT',body:JSON.stringify({name:name.trim()})});updateUser(result.user);setMessage('Your profile has been updated.'); }
    catch(err){setError(err instanceof Error?err.message:'Could not update your profile.');}finally{setBusy('');}
  };
  const changePassword=async(event:FormEvent)=>{
    event.preventDefault();setError('');setMessage('');
    if(password!==confirmation){setError('New passwords do not match.');return;}
    setBusy('password');
    try { await apiRequest('/user/password',{method:'PUT',body:JSON.stringify({currentPassword,password})});logout();navigate('/login',{replace:true,state:{message:'Your password was changed. Sign in with your new password.'}}); }
    catch(err){setError(err instanceof Error?err.message:'Could not change your password.');}finally{setBusy('');}
  };
  return <div className="page-enter max-w-5xl"><PageIntro eyebrow="Your workspace" title="My account" description="Manage your profile, password and access permissions."/>
    {user?.mustChangePassword&&<p role="alert" className="mb-5 rounded-xl bg-safety-50 p-4 text-sm leading-6 text-safety-700">Your account uses a temporary password. Set a new password below before opening your site workspace.</p>}{message&&<p role="status" className="mb-5 rounded-xl bg-signal-greenSoft p-3 text-sm text-signal-green">{message}</p>}{error&&<p role="alert" className="mb-5 rounded-xl bg-signal-redSoft p-3 text-sm text-signal-red">{error}</p>}
    <div className="grid gap-6 lg:grid-cols-2"><Card title="Profile" subtitle="How your name appears to your team"><form onSubmit={profile} className="space-y-5 p-5"><div className="flex items-center gap-3"><span className="rounded-xl bg-steel-50 p-3 text-steel-600"><UserRound size={25}/></span><div><strong className="block text-sm">{user?.name}</strong><small className="text-xs text-ink-400">{roleLabels[role]}</small></div></div><label className="field-label">Full name<input className="field-input" autoComplete="name" required maxLength={120} value={name} onChange={(event)=>setName(event.target.value)}/></label><label className="field-label">Sign-in email<input className="field-input bg-ink-50" disabled value={user?.email||''}/></label><button className="primary-button" disabled={!!busy}>{busy==='profile'?<Loader2 className="animate-spin" size={16}/>:null}Save profile</button></form></Card>
    <Card title="Your access" subtitle="Permissions follow your account and assigned sites"><div className="p-5"><div className="mb-5 flex items-center gap-3 rounded-xl bg-signal-greenSoft p-4"><ShieldCheck size={22} className="text-signal-green"/><div><p className="text-sm font-semibold text-signal-green">{roleLabels[role]}</p><p className="mt-1 text-xs text-signal-green/70">{role==='owner'?'Full workspace oversight':role==='hr'?'Operations within your assigned sites':'Your work, shifts and safety reporting'}</p></div></div><p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-ink-400">Available modules</p><div className="flex flex-wrap gap-2">{roleModules[role].filter((path)=>path!=='/').map((path)=><span key={path} className="rounded-lg border border-ink-200 px-2.5 py-1.5 text-xs capitalize text-ink-600">{path.slice(1).replace(/-/g,' ')}</span>)}</div><p className="mt-5 text-xs leading-5 text-ink-400">Your workspace owner manages site assignments and team access.</p></div></Card>
    {isDemo?<Card title="Demo credentials" subtitle="Sample exploration does not use a client password"><p className="p-5 text-sm leading-6 text-ink-500">Demo personas use isolated sample access. To change a real account password, exit the demo and choose Client sign-in.</p></Card>:<Card title="Change password" subtitle="Changing your password signs out existing sessions"><form className="space-y-4 p-5" onSubmit={changePassword}><label className="field-label">Current password<input className="field-input" autoComplete="current-password" type="password" required value={currentPassword} onChange={(event)=>setCurrentPassword(event.target.value)}/></label><label className="field-label">New password<input className="field-input" autoComplete="new-password" type="password" required minLength={8} maxLength={72} value={password} onChange={(event)=>setPassword(event.target.value)}/><small className="font-normal text-ink-400">Use 8–72 characters and avoid a password you use elsewhere.</small></label><label className="field-label">Confirm new password<input className="field-input" autoComplete="new-password" type="password" required value={confirmation} onChange={(event)=>setConfirmation(event.target.value)}/></label><button className="primary-button" disabled={!!busy}>{busy==='password'?<Loader2 size={16} className="animate-spin"/>:<LockKeyhole size={16}/>}Update password</button></form></Card>}</div>
  </div>;
}
