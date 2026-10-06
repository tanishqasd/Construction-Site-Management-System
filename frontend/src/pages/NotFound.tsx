import { Link } from 'react-router-dom';
import { FileQuestion } from 'lucide-react';
export function NotFound(){return <div className="flex flex-col items-center py-24 text-center"><FileQuestion size={40} className="mb-5 text-ink-400"/><h1 className="text-2xl font-semibold">Page not found</h1><p className="my-4 text-sm text-ink-500">This page may have moved or the address may be incorrect.</p><Link className="primary-button" to="/">Back to dashboard</Link></div>;}
