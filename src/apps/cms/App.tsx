import { type ReactNode, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Route, Switch, useLocation, Router as WouterRouter } from '@/lib/wouter';
import { ErrorBoundary } from '@/apps/cms/components/error-boundary';
import { Toaster } from '@/apps/cms/components/ui/toaster';
import { TooltipProvider } from '@/apps/cms/components/ui/tooltip';
import { Sidebar } from '@/apps/cms/components/Sidebar';
import { ModulePage } from '@/apps/cms/components/ModulePage';
import { clearSession, getStoredToken } from '@/apps/cms/lib/api';
import { modules } from '@/apps/cms/lib/modules';
import Dashboard from '@/apps/cms/pages/Dashboard';
import LoginPage from '@/apps/cms/pages/Login';

const queryClient=new QueryClient({defaultOptions:{queries:{retry:1,refetchOnWindowFocus:false}}});
function Missing(){return <div className="grid min-h-[55vh] place-items-center text-center"><div><p className="font-mono text-[10px] font-bold tracking-[.2em] text-[#9a7653]">404 / TIDAK DITEMUKAN</p><h1 className="mt-3 text-2xl font-bold text-[#403125]">Halaman tidak tersedia</h1><p className="mt-2 text-sm text-[#897c6d]">Alamat ini tidak termasuk ruang kerja Nempo Organizer.</p></div></div>}
function RoutedErrorBoundary({children}:{children:ReactNode}){const [path]=useLocation();return <ErrorBoundary resetKey={path}>{children}</ErrorBoundary>}
function Workspace({onLogout}:{onLogout:()=>void}){
  const [path]=useLocation();
  const pageTitle=path==='/'?'Dashboard':modules[path.slice(1)]?.title||'Ruang kerja';
  return <div className="flex min-h-[100dvh] bg-[#f5f1e9]">
    <Sidebar onLogout={onLogout}/>
    <main className="min-w-0 flex-1">
      <div className="sticky top-0 z-30 flex h-[58px] items-center justify-between border-b border-[#e7ddcf] bg-[#f9f6f0]/90 pl-[62px] pr-4 backdrop-blur-md sm:px-7 lg:pl-8">
        <div className="flex items-center gap-2 text-xs"><span className="text-[#a28b70]">Nempo Organizer</span><span className="text-[#c5b8a7]">/</span><span className="font-semibold text-[#564535]">{pageTitle}</span></div>
        <div className="hidden items-center gap-2 rounded-full border border-[#e6dccf] bg-[#fffdf9] px-3 py-1.5 text-[10px] font-semibold text-[#816a50] sm:flex"><span className="h-1.5 w-1.5 rounded-full bg-[#87a984]"/>Lingkungan CMS terisolasi</div>
        <div className="sm:hidden h-2 w-2 rounded-full bg-[#87a984]" title="Lingkungan CMS terisolasi"/>
      </div>
      <div className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 sm:py-7 lg:px-9 lg:py-8">
        <RoutedErrorBoundary><Switch>
          <Route path="/" component={Dashboard}/>
          {Object.keys(modules).map(slug=><Route key={slug} path={`/${slug}`} component={()=> <ModulePage slug={slug}/>}/>)}
          <Route component={Missing}/>
        </Switch></RoutedErrorBoundary>
        <footer className="mt-10 flex flex-col gap-1 border-t border-[#e6dccf] py-5 text-[10px] text-[#a0917e] sm:flex-row sm:items-center sm:justify-between"><span>Nempo Organizer · Back-office konten Garut</span><span>Data hanya melalui API Garut terpisah</span></footer>
      </div>
    </main>
  </div>;
}
function App(){
  const [token,setToken]=useState<string|null>(()=>getStoredToken()||null);
  function logout(){clearSession();setToken(null);}
  return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={"/cms/".replace(/\/$/,'')}>
    {token?<Workspace onLogout={logout}/>:<LoginPage onLogin={setToken}/>}
  </WouterRouter><Toaster/></TooltipProvider></QueryClientProvider>;
}
export default App;
