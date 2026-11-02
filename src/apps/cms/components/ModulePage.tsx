import { useCallback, useEffect, useMemo, useState } from 'react';
import { AlertCircle, Archive, Check, DatabaseBackup, LoaderCircle, Pencil, Plus, RefreshCw, ScanLine, Search, Trash2, X } from 'lucide-react';
import { ApiError, apiOrigin, asRows, getStoredToken, request, resourceApi, type Entity } from '@/apps/cms/lib/api';
import { modules } from '@/apps/cms/lib/modules';

type Props={slug:string};
function titleCase(value:string){return value.replaceAll('_',' ').replace(/\b\w/g,c=>c.toUpperCase());}
function display(value:unknown){if(value===null||value===undefined||value==='')return '—';if(typeof value==='object')return Array.isArray(value)?`${value.length} item`:JSON.stringify(value);return String(value);}
export function ModulePage({slug}:Props) {
  const spec=modules[slug];
  const [rows,setRows]=useState<Entity[]>([]);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState('');
  const [search,setSearch]=useState('');
  const [modal,setModal]=useState<Entity|null|false>(false);
  const [payload,setPayload]=useState<Record<string,unknown>>({});
  const [saving,setSaving]=useState(false);
  const [uploading,setUploading]=useState(false);
  const [notice,setNotice]=useState('');
  const [jajanView,setJajanView]=useState<'menu'|'orders'>('menu');
  const load=useCallback(async()=>{
    setLoading(true);setError('');
    try {
      if(slug==='settings'){
        const result=await request<unknown>('/api/admin/settings');
        setRows(asRows(result));
      } else if(slug==='event-orders'){
        const result=await request<unknown>('/api/event-orders');
        setRows(asRows(result));
      } else if(slug==='jajan-yuk'){
        const result=await request<unknown>(jajanView==='menu'?'/api/admin/jajan-yuk/menu-items':'/api/admin/jajan-yuk/orders');
        setRows(asRows(result));
      } else if(spec.endpoint) {
        setRows(asRows(await request<unknown>(spec.endpoint)));
      } else setRows(asRows(await resourceApi.list(slug)));
    } catch(e){setError(e instanceof Error?e.message:'Gagal memuat data.');setRows([]);}
    finally{setLoading(false);}
  },[slug,spec,jajanView]);
  useEffect(()=>{void load();},[load]);
  const filtered=useMemo(()=>rows.filter(row=>JSON.stringify(row).toLocaleLowerCase().includes(search.toLocaleLowerCase())),[rows,search]);
  const keys=useMemo(()=>{
    if(spec.fields?.length)return spec.fields.map(f=>f.key);
    const set=new Set<string>();
    rows.slice(0,8).forEach(row=>Object.keys(row).forEach(k=>{if(k!=='id'&&!k.toLowerCase().includes('password'))set.add(k);}));
    return [...set].slice(0,6);
  },[rows,spec.fields]);
  function openCreate(){setPayload(Object.fromEntries((spec.fields||[]).map(f=>[f.key,f.type==='checkbox'?false:''])));setModal(null);}
  function openEdit(row:Entity){setPayload({...row});setModal(row);}
  async function save(e:React.FormEvent){
    e.preventDefault();setSaving(true);setNotice('');
    try{
      if(slug==='settings') await request('/api/admin/settings','PUT',payload);
      else if(slug==='jajan-yuk') await request(`/api/admin/jajan-yuk/menu-items${modal&&typeof modal==='object'?`/${modal.id}`:''}`,modal&&typeof modal==='object'?'PUT':'POST',payload);
      else if(modal&&typeof modal==='object') await resourceApi.update(slug,String(modal.id),payload);
      else await resourceApi.create(slug,payload);
      setModal(false);setNotice('Perubahan berhasil disimpan.');await load();
    }catch(e){setNotice(e instanceof Error?e.message:'Tidak dapat menyimpan perubahan.');}
    finally{setSaving(false);}
  }
  async function remove(row:Entity){
    const name=String(row.name||row.title||row.id||'data ini');
    if(!window.confirm(`Hapus ${name}? Tindakan ini tidak dapat dibatalkan.`))return;
    try{if(slug==='jajan-yuk')await request(`/api/admin/jajan-yuk/menu-items/${row.id}`,'DELETE');else await resourceApi.remove(slug,String(row.id));await load();setNotice('Data berhasil dihapus.');}
    catch(e){setNotice(e instanceof Error?e.message:'Data gagal dihapus.');}
  }
  async function orderAction(row:Entity,action:'confirm'|'reject'|'delete'){
    if(action==='delete'&&!window.confirm(`Hapus pesanan ${String(row.id??'')}?`))return;
    const notes=action==='reject'?window.prompt('Catatan penolakan (opsional):')??'':'';
    try{
      const id=encodeURIComponent(String(row.id));
      if(action==='confirm')await request(`/api/event-orders/${id}/confirm`,'PUT',{});
      if(action==='reject')await request(`/api/event-orders/${id}/reject`,'PUT',{notes});
      if(action==='delete')await request(`/api/event-orders/${id}`,'DELETE');
      setNotice(action==='delete'?'Pesanan dihapus.':action==='confirm'?'Pesanan dikonfirmasi.':'Pesanan ditolak.');
      await load();
    }catch(e){setNotice(e instanceof Error?e.message:'Tindakan pada pesanan gagal.');}
  }
  async function uploadImage(file?:File){
    if(!file)return;
    setUploading(true);setNotice('');
    try{
      const body=new FormData();body.append('file',file);
      const result=await request<{url:string}>('/api/admin/upload','POST',body);
      if(!result?.url)throw new Error('Unggahan tidak mengembalikan URL gambar.');
      setPayload(p=>({...p,image:result.url}));setNotice('Gambar berhasil diunggah.');
    }catch(e){setNotice(e instanceof Error?e.message:'Gambar gagal diunggah.');}
    finally{setUploading(false);}
  }
  if(slug==='ticket-scanner') return <TicketScanner spec={spec} />;
  if(slug==='backup') return <Backup spec={spec} />;
  const editable=(!spec.readonly && (Boolean(spec.fields?.length)||Boolean(resourceEndpoint(slug))))||(slug==='jajan-yuk'&&jajanView==='menu');
  return <div className="fade-up space-y-6">
    <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div><div className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.18em] text-[#9a7653]"><span>Ruang kerja</span><span className="h-px w-5 bg-[#c9b69e]"/><span>Konten</span></div><h1 className="text-[30px] font-bold tracking-[-.04em] text-[#35291f]">{spec.title}</h1><p className="mt-1 text-sm text-[#84776a]">{spec.description}</p></div>
      <div className="flex gap-2">{editable&&<button onClick={openCreate} className="flex items-center gap-2 rounded-lg bg-[#805538] px-4 py-2.5 text-xs font-bold text-[#fffaf3] shadow-sm transition hover:bg-[#67432d]"><Plus size={15}/> Tambah data</button>}</div>
    </header>
    <section className="overflow-hidden rounded-2xl border border-[#e5dacb] bg-[#fffdf9] shadow-[0_8px_28px_rgba(81,58,34,.045)]">
      {slug==='jajan-yuk'&&<div className="flex gap-1 border-b border-[#eee5da] px-5 pt-3"><button onClick={()=>setJajanView('menu')} className={`rounded-t-lg px-4 py-2 text-xs font-semibold ${jajanView==='menu'?'border-b-2 border-[#805538] text-[#805538]':'text-[#938472]'}`}>Menu</button><button onClick={()=>setJajanView('orders')} className={`rounded-t-lg px-4 py-2 text-xs font-semibold ${jajanView==='orders'?'border-b-2 border-[#805538] text-[#805538]':'text-[#938472]'}`}>Pesanan</button></div>}
      <div className="flex flex-col gap-3 border-b border-[#eee5da] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <div><h2 className="text-sm font-bold text-[#443428]">Daftar {spec.title}</h2><p className="mt-0.5 text-[11px] text-[#9a8d7f]">{loading?'Memuat dari layanan CMS…':`${filtered.length} data`}</p></div>
        <div className="flex gap-2"><label className="flex h-9 min-w-0 items-center gap-2 rounded-lg border border-[#e8ded1] bg-[#fbf8f2] px-3 text-[#958675] sm:w-64"><Search size={14}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Cari data..." className="w-full bg-transparent text-xs text-[#46372b] outline-none placeholder:text-[#b1a496]"/></label><button onClick={()=>void load()} className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-[#e8ded1] text-[#715b46] hover:bg-[#f5eee5]" aria-label="Muat ulang"><RefreshCw size={14} className={loading?'animate-spin':''}/></button></div>
      </div>
      {notice&&<div className="flex items-center justify-between border-b border-[#eee5da] bg-[#f8f3ea] px-5 py-2.5 text-xs text-[#765739]"><span>{notice}</span><button onClick={()=>setNotice('')} aria-label="Tutup"><X size={14}/></button></div>}
      {error?<div className="mx-4 my-5 flex items-start gap-3 rounded-xl border border-[#ead4c8] bg-[#fcf2ed] p-4 sm:mx-5"><AlertCircle size={18} className="mt-0.5 shrink-0 text-[#a9593e]"/><div className="flex-1"><p className="text-sm font-semibold text-[#6a3c2d]">Data belum dapat dimuat</p><p className="mt-1 break-words text-xs leading-5 text-[#895e4e]">{error}</p></div><button onClick={()=>void load()} className="rounded-md px-2 py-1 text-xs font-bold text-[#795239] hover:bg-[#f3e3d8]">Coba lagi</button></div>:
       loading?<div className="space-y-3 p-5">{[0,1,2,3].map(n=><div key={n} className="h-12 animate-pulse rounded-lg bg-[#f2ece3]"/> )}</div>:
       filtered.length===0?<div className="grid min-h-52 place-items-center px-5 py-12 text-center"><div><div className="mx-auto mb-3 grid h-11 w-11 place-items-center rounded-full bg-[#f2eadf] text-[#997751]"><Search size={17}/></div><p className="text-sm font-semibold text-[#584738]">{rows.length?'Tidak ada hasil yang cocok':'Belum ada data dari layanan'}</p><p className="mt-1 text-xs text-[#9a8d7f]">{rows.length?'Ubah kata kunci pencarian.':'Data akan muncul setelah API Garut tersedia.'}</p></div></div>:
       <div className="scrollbar-thin overflow-x-auto"><table className="w-full min-w-[660px] border-collapse text-left"><thead className="bg-[#f8f4ed]"><tr><th className="w-14 px-5 py-3 text-[9px] font-bold uppercase tracking-[.14em] text-[#9a8a78]">ID</th>{keys.map(key=><th key={key} className="px-3 py-3 text-[9px] font-bold uppercase tracking-[.14em] text-[#9a8a78]">{titleCase(key)}</th>)}{(editable||slug==='event-orders'||(slug==='jajan-yuk'&&jajanView==='orders'))&&<th className="px-4 py-3 text-right text-[9px] font-bold uppercase tracking-[.14em] text-[#9a8a78]">Aksi</th>}</tr></thead><tbody className="divide-y divide-[#f0e8dd]">{filtered.map((row,index)=><tr key={String(row.id??index)} className="group hover:bg-[#fcfaf6]"><td className="px-5 py-3.5 text-[10px] text-[#ab9b88] mono">{String(row.id??'—')}</td>{keys.map(key=><td key={key} className="max-w-[260px] truncate px-3 py-3.5 text-xs text-[#594b3d]" title={display(row[key])}>{key==='image'||key==='logo'?<span className="flex items-center gap-2">{typeof row[key]==='string'&&row[key]?<img src={String(row[key])} alt="" className="h-8 w-10 rounded-md border border-[#e8ded1] object-cover"/>:<span className="text-[#b1a496]">—</span>}</span>:display(row[key])}</td>)}{editable&&<td className="px-4 py-3 text-right"><div className="inline-flex gap-1 opacity-70 transition group-hover:opacity-100"><button onClick={()=>openEdit(row)} className="grid h-8 w-8 place-items-center rounded-md text-[#866b4f] hover:bg-[#f1e8db]" aria-label={`Ubah ${String(row.name||row.title||'data')}`}><Pencil size={14}/></button><button onClick={()=>void remove(row)} className="grid h-8 w-8 place-items-center rounded-md text-[#a66250] hover:bg-[#faeeea]" aria-label="Hapus data"><Trash2 size={14}/></button></div></td>}{slug==='event-orders'&&<td className="px-4 py-3 text-right"><div className="inline-flex gap-1"><button onClick={()=>void orderAction(row,'confirm')} className="rounded-md bg-[#e9f0e5] px-2 py-1.5 text-[10px] font-bold text-[#55714e] hover:bg-[#dce9d5]">Konfirmasi</button><button onClick={()=>void orderAction(row,'reject')} className="rounded-md bg-[#f8eee6] px-2 py-1.5 text-[10px] font-bold text-[#98684b] hover:bg-[#f0e2d5]">Tolak</button><button onClick={()=>void orderAction(row,'delete')} aria-label="Hapus pesanan" className="grid h-7 w-7 place-items-center rounded-md text-[#a66250] hover:bg-[#faeeea]"><Trash2 size={13}/></button></div></td>}{slug==='jajan-yuk'&&jajanView==='orders'&&<td className="px-4 py-3 text-right"><div className="inline-flex gap-1"><button onClick={async()=>{try{await request(`/api/admin/jajan-yuk/orders/${row.id}/manual-payment`,'POST',{action:'verify'});await load();}catch(e){setNotice(e instanceof Error?e.message:'Pembayaran tidak dapat diverifikasi.');}}} className="rounded-md bg-[#e9f0e5] px-2 py-1.5 text-[10px] font-bold text-[#55714e] hover:bg-[#dce9d5]">Verifikasi bayar</button><button onClick={async()=>{try{await request(`/api/admin/jajan-yuk/orders/${row.id}/manual-payment`,'POST',{action:'reject'});await load();}catch(e){setNotice(e instanceof Error?e.message:'Pembayaran tidak dapat ditolak.');}}} className="rounded-md bg-[#f8eee6] px-2 py-1.5 text-[10px] font-bold text-[#98684b] hover:bg-[#f0e2d5]">Tolak bayar</button></div></td>}</tr>)}</tbody></table></div>}
      <div className="flex items-center justify-between border-t border-[#eee5da] bg-[#fcfaf6] px-5 py-3 text-[10px] text-[#a09282]"><span>Data tersinkron dari API Nempo Organizer Garut</span><span className="mono">{filtered.length} {filtered.length===1?'record':'records'}</span></div>
    </section>
    {modal!==false&&<div className="fixed inset-0 z-[70] flex items-end justify-center bg-[#241a13]/45 p-0 backdrop-blur-[2px] sm:items-center sm:p-5" onMouseDown={e=>{if(e.target===e.currentTarget)setModal(false);}}>
      <form onSubmit={save} className="max-h-[92dvh] w-full max-w-2xl overflow-y-auto rounded-t-2xl border border-[#e7ddce] bg-[#fffdf9] shadow-2xl sm:rounded-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#eee5da] bg-[#fffdf9]/95 px-5 py-4 backdrop-blur"><div><h2 className="text-base font-bold text-[#403125]">{modal?'Ubah':'Tambah'} {spec.title}</h2><p className="mt-0.5 text-xs text-[#948575]">Data akan dikirim ke layanan CMS Garut.</p></div><button type="button" onClick={()=>setModal(false)} className="grid h-8 w-8 place-items-center rounded-lg text-[#897865] hover:bg-[#f4eee5]" aria-label="Tutup"><X size={17}/></button></div>
        <div className="grid gap-x-4 gap-y-1 p-5 sm:grid-cols-2">{(spec.fields||[]).map(field=><label key={field.key} className={`mb-3 block ${field.type==='textarea'?'sm:col-span-2':''}`}><span className="mb-1.5 block text-[11px] font-semibold text-[#655443]">{field.label}{field.required&&<span className="ml-1 text-[#aa6048]">*</span>}</span>
          {field.type==='checkbox'?<span className="flex h-10 items-center gap-2 rounded-lg border border-[#e7ddce] px-3"><input type="checkbox" checked={Boolean(payload[field.key])} onChange={e=>setPayload(p=>({...p,[field.key]:e.target.checked}))} className="accent-[#805538]"/><span className="text-xs text-[#716150]">Aktifkan</span></span>:
          field.type==='textarea'?<textarea rows={4} required={field.required} value={String(payload[field.key]??'')} onChange={e=>setPayload(p=>({...p,[field.key]:e.target.value}))} className="w-full resize-y rounded-lg border border-[#e7ddce] bg-[#fcfaf6] px-3 py-2.5 text-xs text-[#40352b] outline-none focus:border-[#ad895e] focus:ring-2 focus:ring-[#ad895e]/15"/>:
          field.type==='url'&&(field.key==='image'||field.key==='logo')?<div className="space-y-2"><input type="url" required={field.required} value={String(payload[field.key]??'')} onChange={e=>setPayload(p=>({...p,[field.key]:e.target.value}))} className="h-10 w-full rounded-lg border border-[#e7ddce] bg-[#fcfaf6] px-3 text-xs text-[#40352b] outline-none focus:border-[#ad895e] focus:ring-2 focus:ring-[#ad895e]/15"/><label className={`inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-[#e6dccf] px-2.5 py-1.5 text-[10px] font-semibold text-[#806548] hover:bg-[#f7f1e8] ${uploading?'pointer-events-none opacity-50':''}`}><Plus size={12}/>{uploading?'Mengunggah…':'Unggah gambar'}<input type="file" accept="image/*" className="hidden" disabled={uploading} onChange={e=>{void uploadImage(e.target.files?.[0]);e.currentTarget.value='';}}/></label></div>:
          <input type={field.type||'text'} required={field.required} value={field.type==='date'&&payload[field.key]?String(payload[field.key]).slice(0,10):String(payload[field.key]??'')} onChange={e=>setPayload(p=>({...p,[field.key]:field.type==='number'?(e.target.value===''?'':Number(e.target.value)):e.target.value}))} className="h-10 w-full rounded-lg border border-[#e7ddce] bg-[#fcfaf6] px-3 text-xs text-[#40352b] outline-none focus:border-[#ad895e] focus:ring-2 focus:ring-[#ad895e]/15"/>}
        </label>)}</div>
        {!spec.fields?.length&&<div className="px-5 pb-4"><label className="mb-1.5 block text-[11px] font-semibold text-[#655443]">Payload JSON</label><textarea rows={9} value={JSON.stringify(payload,null,2)} onChange={e=>{try{setPayload(JSON.parse(e.target.value) as Record<string,unknown>);}catch{}}} className="w-full rounded-lg border border-[#e7ddce] bg-[#fcfaf6] p-3 font-mono text-xs outline-none focus:border-[#ad895e]"/></div>}
        {notice&&<p className="mx-5 mb-3 rounded-lg bg-[#fcf2ed] px-3 py-2 text-xs text-[#8e4d39]">{notice}</p>}
        <div className="sticky bottom-0 flex justify-end gap-2 border-t border-[#eee5da] bg-[#fffdf9]/95 px-5 py-4 backdrop-blur"><button type="button" onClick={()=>setModal(false)} className="rounded-lg border border-[#e5dacb] px-4 py-2.5 text-xs font-semibold text-[#716150] hover:bg-[#f7f2eb]">Batal</button><button disabled={saving} className="flex items-center gap-2 rounded-lg bg-[#805538] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#67432d] disabled:opacity-60">{saving?<LoaderCircle size={14} className="animate-spin"/>:<Check size={14}/>}Simpan</button></div>
      </form>
    </div>}
  </div>;
}
function resourceEndpoint(slug:string){return slug==='settings'||!!(modules[slug]&&!modules[slug].endpoint&&slug!=='ticket-scanner'&&slug!=='backup');}
function TicketScanner({spec}:{spec:typeof modules[string]}) {
  const [code,setCode]=useState('');const [busy,setBusy]=useState(false);const [result,setResult]=useState('');const [error,setError]=useState('');
  async function check(e:React.FormEvent){e.preventDefault();setBusy(true);setResult('');setError('');try{const data=await request<unknown>(`/api/event-orders/checkin/${encodeURIComponent(code.trim())}`,'POST',{});setResult(typeof data==='object'?JSON.stringify(data,null,2):String(data));}catch(e){setError(e instanceof Error?e.message:'Pemeriksaan tiket gagal.');}finally{setBusy(false);}}
  return <div className="fade-up"><PageHeader spec={spec}/><section className="mt-6 max-w-2xl rounded-2xl border border-[#e5dacb] bg-[#fffdf9] p-6 shadow-[0_8px_28px_rgba(81,58,34,.045)]"><div className="mb-5 grid h-12 w-12 place-items-center rounded-xl bg-[#efe5d7] text-[#805538]"><ScanLine size={22}/></div><h2 className="text-lg font-bold text-[#403125]">Validasi tiket</h2><p className="mt-1 text-sm text-[#84776a]">Masukkan kode tiket untuk memeriksa tiket masuk melalui layanan event-order.</p><form onSubmit={check} className="mt-5 flex flex-col gap-2 sm:flex-row"><input value={code} onChange={e=>setCode(e.target.value)} required placeholder="Kode tiket" className="h-11 flex-1 rounded-lg border border-[#e7ddce] bg-[#fcfaf6] px-3 text-sm outline-none focus:border-[#ad895e]"/><button disabled={busy} className="flex h-11 items-center justify-center gap-2 rounded-lg bg-[#805538] px-5 text-xs font-bold text-white disabled:opacity-60">{busy&&<LoaderCircle size={14} className="animate-spin"/>}Periksa tiket</button></form>{error&&<div className="mt-4 rounded-lg border border-[#ead4c8] bg-[#fcf2ed] p-3 text-xs text-[#89513e]">{error}</div>}{result&&<pre className="mt-4 overflow-auto rounded-lg bg-[#f5f0e8] p-4 text-xs text-[#524436]">{result}</pre>}</section></div>;
}
function Backup({spec}:{spec:typeof modules[string]}) {
  const [busy,setBusy]=useState(false);const [status,setStatus]=useState('');
  async function exportData(){setBusy(true);setStatus('');try{const origin=apiOrigin();if(!origin)throw new ApiError('API belum dikonfigurasi atau VITE_NEMPO_GARUT_API_URL tidak memenuhi aturan origin terpisah.');const r=await fetch(`${origin}/api/admin/backup/export`,{headers:{Authorization:`Bearer ${getStoredToken()}`}});if(!r.ok)throw new ApiError(`Ekspor gagal (${r.status}).`);const blob=await r.blob();const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=`nempo-garut-backup-${new Date().toISOString().slice(0,10)}.json`;a.click();URL.revokeObjectURL(url);setStatus('File backup berhasil diunduh.');}catch(e){setStatus(e instanceof Error?e.message:'Ekspor backup gagal.');}finally{setBusy(false);}}
  async function restore(file?:File){if(!file)return;if(!window.confirm('Pulihkan data dari file ini? Pastikan backup yang dipilih benar.'))return;setBusy(true);setStatus('');try{if(!apiOrigin())throw new ApiError('API belum dikonfigurasi atau VITE_NEMPO_GARUT_API_URL tidak memenuhi aturan origin terpisah.');const body=new FormData();body.append('backup',file);const response=await fetch(`${apiOrigin()}/api/admin/backup/import`,{method:'POST',headers:{Authorization:`Bearer ${getStoredToken()}`},body});const data=await response.json();if(!response.ok)throw new ApiError(data.error||'Pemulihan backup gagal.');setStatus(data.message||`Pemulihan selesai. Baris masuk: ${data.importedRows??0}.`);}catch(e){setStatus(e instanceof Error?e.message:'Pemulihan backup gagal.');}finally{setBusy(false);}}
  return <div className="fade-up"><PageHeader spec={spec}/><section className="mt-6 grid gap-4 md:grid-cols-2"><div className="rounded-2xl border border-[#e5dacb] bg-[#fffdf9] p-6"><div className="mb-4 grid h-11 w-11 place-items-center rounded-xl bg-[#efe5d7] text-[#805538]"><DatabaseBackup size={20}/></div><h2 className="font-bold text-[#403125]">Ekspor backup</h2><p className="mt-1 text-xs leading-5 text-[#84776a]">Unduh salinan JSON melalui endpoint backup layanan yang terhubung.</p><button onClick={()=>void exportData()} disabled={busy} className="mt-5 rounded-lg bg-[#805538] px-4 py-2.5 text-xs font-bold text-white disabled:opacity-60">{busy?'Memproses…':'Unduh backup'}</button></div><div className="rounded-2xl border border-[#e5dacb] bg-[#fffdf9] p-6"><div className="mb-4 grid h-11 w-11 place-items-center rounded-xl bg-[#f2ebdf] text-[#805538]"><Archive size={20}/></div><h2 className="font-bold text-[#403125]">Pulihkan backup</h2><p className="mt-1 text-xs leading-5 text-[#84776a]">Pilih file backup JSON yang telah diekspor dari CMS ini.</p><label className="mt-5 inline-flex cursor-pointer rounded-lg border border-[#d9c8b1] px-4 py-2.5 text-xs font-bold text-[#72573d] hover:bg-[#f8f2e9]">Pilih file<input type="file" accept=".json,application/json" className="hidden" disabled={busy} onChange={e=>{void restore(e.target.files?.[0]);e.currentTarget.value='';}}/></label></div>{status&&<p className="md:col-span-2 rounded-lg border border-[#e6dac8] bg-[#f8f2e9] px-4 py-3 text-xs text-[#755a3d]">{status}</p>}</section></div>;
}
function PageHeader({spec}:{spec:typeof modules[string]}){return <header><div className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.18em] text-[#9a7653]">Ruang kerja <span className="h-px w-5 bg-[#c9b69e]"/>Operasional</div><h1 className="text-[30px] font-bold tracking-[-.04em] text-[#35291f]">{spec.title}</h1><p className="mt-1 text-sm text-[#84776a]">{spec.description}</p></header>}
