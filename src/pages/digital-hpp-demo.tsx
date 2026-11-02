import { Layout } from "@/components/layout";
import { SEO } from "@/components/seo";
import { DigitalPreviewGate } from "@/components/digital-preview-gate";
import { Link } from "@/lib/wouter";
import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  BookOpen,
  Calculator,
  Check,
  CircleAlert,
  CircleCheck,
  CircleDollarSign,
  Download,
  Eye,
  EyeOff,
  FileSpreadsheet,
  Gauge,
  History,
  LayoutDashboard,
  Package,
  Pencil,
  Plus,
  RefreshCcw,
  Search,
  Settings2,
  Sparkles,
  Target,
  TrendingUp,
  UtensilsCrossed,
  Warehouse,
  X,
} from "lucide-react";
import "./digital-demo-super-app.css";

type HppView = "overview" | "recipes" | "ingredients" | "simulator" | "reports";
type IngredientCategory = "Bahan baku" | "Dairy" | "Bumbu" | "Kemasan";

type Ingredient = {
  id: string;
  name: string;
  unit: string;
  cost: number;
  stock: number;
  category: IngredientCategory;
  supplier: string;
};

type RecipeComponent = {
  ingredientId: string;
  quantity: number;
};

type Recipe = {
  id: string;
  name: string;
  category: string;
  price: number;
  portions: number;
  components: RecipeComponent[];
  status: "Aktif" | "Draft";
};

const navItems: Array<{ id: HppView; label: string; icon: typeof LayoutDashboard }> = [
  { id: "overview", label: "Ringkasan HPP", icon: LayoutDashboard },
  { id: "recipes", label: "Menu & resep", icon: BookOpen },
  { id: "ingredients", label: "Komponen bahan", icon: Warehouse },
  { id: "simulator", label: "Simulasi harga", icon: Calculator },
  { id: "reports", label: "Laporan margin", icon: BarChart3 },
];

const initialIngredients: Ingredient[] = [
  { id: "ingredient-coffee", name: "Biji kopi Arabica", unit: "kg", cost: 145000, stock: 2.4, category: "Bahan baku", supplier: "Kopi Gunung Putri" },
  { id: "ingredient-milk", name: "Susu segar", unit: "liter", cost: 22000, stock: 8, category: "Dairy", supplier: "Mitra Susu Garut" },
  { id: "ingredient-palm-sugar", name: "Gula aren", unit: "kg", cost: 78000, stock: 3.2, category: "Bumbu", supplier: "Pangirutan Organik" },
  { id: "ingredient-chicken", name: "Ayam fillet", unit: "kg", cost: 48000, stock: 6.5, category: "Bahan baku", supplier: "Segar Makmur" },
  { id: "ingredient-rice", name: "Beras pandan wangi", unit: "kg", cost: 16000, stock: 18, category: "Bahan baku", supplier: "Toko Pangan Garut" },
  { id: "ingredient-chili", name: "Saus sambal", unit: "liter", cost: 46000, stock: 1.1, category: "Bumbu", supplier: "Rasa Nusantara" },
  { id: "ingredient-croissant", name: "Croissant butter", unit: "pcs", cost: 11000, stock: 18, category: "Bahan baku", supplier: "Dapur Pagi" },
  { id: "ingredient-cup", name: "Cup 16 oz", unit: "pcs", cost: 950, stock: 42, category: "Kemasan", supplier: "Kemasan Berkah" },
];

const initialRecipes: Recipe[] = [
  {
    id: "recipe-kopi-aren",
    name: "Es Kopi Aren",
    category: "Minuman kopi",
    price: 28000,
    portions: 1,
    components: [
      { ingredientId: "ingredient-coffee", quantity: 0.018 },
      { ingredientId: "ingredient-milk", quantity: 0.12 },
      { ingredientId: "ingredient-palm-sugar", quantity: 0.025 },
      { ingredientId: "ingredient-cup", quantity: 1 },
    ],
    status: "Aktif",
  },
  {
    id: "recipe-nasi-ayam",
    name: "Nasi Ayam Sambal",
    category: "Makanan utama",
    price: 32000,
    portions: 1,
    components: [
      { ingredientId: "ingredient-chicken", quantity: 0.14 },
      { ingredientId: "ingredient-rice", quantity: 0.18 },
      { ingredientId: "ingredient-chili", quantity: 0.03 },
    ],
    status: "Aktif",
  },
  {
    id: "recipe-croissant",
    name: "Croissant Latte Set",
    category: "Paket sarapan",
    price: 39000,
    portions: 1,
    components: [
      { ingredientId: "ingredient-croissant", quantity: 1 },
      { ingredientId: "ingredient-coffee", quantity: 0.018 },
      { ingredientId: "ingredient-milk", quantity: 0.1 },
      { ingredientId: "ingredient-cup", quantity: 1 },
    ],
    status: "Aktif",
  },
  {
    id: "recipe-sambal",
    name: "Sambal Rumah",
    category: "Pelengkap",
    price: 8000,
    portions: 1,
    components: [{ ingredientId: "ingredient-chili", quantity: 0.04 }],
    status: "Draft",
  },
];

const HPP_PREVIEW_PASSWORD = "nemposukses";
const HPP_PREVIEW_ACCESS_KEY = "nempo_hpp_preview_access";
const rupiah = (value: number) => `Rp${Math.round(value).toLocaleString("id-ID")}`;
const compactRupiah = (value: number) => `Rp${Math.round(value / 1000).toLocaleString("id-ID")}K`;
const formatQty = (value: number) => value.toLocaleString("id-ID", { maximumFractionDigits: 3 });

function HppPreviewGate({ onUnlock }: { onUnlock: () => void }) {
  return <DigitalPreviewGate title="HPP" description="Masukkan password untuk membuka preview perhitungan biaya, margin, dan harga pokok penjualan." onUnlock={onUnlock}>{null}</DigitalPreviewGate>;

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (password === HPP_PREVIEW_PASSWORD) {
      localStorage.setItem(HPP_PREVIEW_ACCESS_KEY, "1");
      onUnlock();
    } else {
      setError(true);
    }
  }

  return (
    <main className="nempo-demo-green nempo-hpp-gate flex min-h-[100dvh] items-center justify-center bg-[#f4f7f7] px-5 text-[#183b43]">
      <div className="w-full max-w-md border border-[#dcebea] bg-[#fbfdfd] p-6 shadow-[0_22px_70px_rgba(24,59,67,0.12)] sm:p-8">
        <div className="mb-7 flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#0f766e] text-white shadow-lg shadow-teal-800/20"><Calculator className="h-5 w-5" /></div>
          <div><p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#0f9b8e]">Live preview</p><h1 className="mt-1 text-xl font-black tracking-tight text-[#183b43]">HPP Control</h1></div>
        </div>
        <p className="text-sm leading-6 text-[#648084]">Masukkan password untuk membuka demo kalkulasi HPP, resep, margin, dan simulasi harga jual.</p>
        <form onSubmit={submit} className="mt-6 space-y-3">
          <input type="text" name="username" autoComplete="username" value="hpp-preview" readOnly tabIndex={-1} aria-hidden="true" className="sr-only" />
          <label className={`flex items-center gap-3 rounded-xl border bg-white px-3.5 py-3 transition-colors ${error ? "border-[#b75c54] bg-[#fff8f5]" : "border-[#dcebea] focus-within:border-[#0f766e]"}`}>
            <Settings2 className={`h-4 w-4 shrink-0 ${error ? "text-[#b75c54]" : "text-[#7da5a2]"}`} />
            <span className="sr-only">Password live preview HPP</span>
            <input type={showPassword ? "text" : "password"} value={password} onChange={(event) => { setPassword(event.target.value); setError(false); }} placeholder="Masukkan password" autoComplete="current-password" autoFocus className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-[#183b43] outline-none placeholder:text-[#9db5b5]" />
            <button type="button" onClick={() => setShowPassword((current) => !current)} aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"} className="text-[#7da5a2] hover:text-[#0f766e]">{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
          </label>
          {error && <p className="text-xs font-semibold text-[#b75c54]">Password salah. Coba lagi.</p>}
          <button type="submit" className="w-full rounded-xl bg-[#0f766e] px-4 py-3 text-xs font-black text-white hover:bg-[#0b625c]">Masuk ke preview</button>
        </form>
        <p className="mt-5 flex items-center gap-2 text-[10px] font-semibold text-[#8aa1a3]"><Sparkles className="h-3.5 w-3.5 text-[#0f9b8e]" /> Demo data untuk presentasi customer.</p>
      </div>
    </main>
  );
}

export default function DigitalHppDemoPage() {
  const [unlocked, setUnlocked] = useState(false);
  if (!unlocked) return <HppPreviewGate onUnlock={() => setUnlocked(true)} />;
  return <HppWorkspace />;
}

function calculateRecipe(recipe: Recipe, ingredients: Ingredient[]) {
  const cost = recipe.components.reduce((total, component) => {
    const ingredient = ingredients.find((entry) => entry.id === component.ingredientId);
    return total + (ingredient?.cost ?? 0) * component.quantity;
  }, 0) / Math.max(recipe.portions, 1);
  const foodCost = recipe.price ? (cost / recipe.price) * 100 : 0;
  return { cost, foodCost, margin: recipe.price - cost, marginPercent: 100 - foodCost };
}

function HppWorkspace() {
  const [activeView, setActiveView] = useState<HppView>("overview");
  const [recipes, setRecipes] = useState(initialRecipes);
  const [ingredients, setIngredients] = useState(initialIngredients);
  const [query, setQuery] = useState("");
  const [toast, setToast] = useState<string | null>(null);
  const [recipeModal, setRecipeModal] = useState<Recipe | "new" | null>(null);
  const [ingredientModal, setIngredientModal] = useState<Ingredient | null>(null);
  const [selectedRecipeId, setSelectedRecipeId] = useState(initialRecipes[0].id);

  function notify(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(null), 2600);
  }

  function resetDemo() {
    setActiveView("overview");
    setRecipes(initialRecipes);
    setIngredients(initialIngredients);
    setQuery("");
    setRecipeModal(null);
    setIngredientModal(null);
    setSelectedRecipeId(initialRecipes[0].id);
    notify("Demo HPP dikembalikan ke data awal.");
  }

  function saveRecipe(recipe: Recipe) {
    setRecipes((current) => current.some((entry) => entry.id === recipe.id) ? current.map((entry) => entry.id === recipe.id ? recipe : entry) : [recipe, ...current]);
    setRecipeModal(null);
    setSelectedRecipeId(recipe.id);
    notify(`${recipe.name} berhasil disimpan.`);
  }

  function saveIngredient(ingredient: Ingredient) {
    setIngredients((current) => current.map((entry) => entry.id === ingredient.id ? ingredient : entry));
    setIngredientModal(null);
    notify(`Biaya ${ingredient.name} diperbarui.`);
  }

  function exportReport() {
    const rows = [["Menu", "Kategori", "Harga jual", "HPP / porsi", "Food cost", "Margin"], ...recipes.map((recipe) => {
      const result = calculateRecipe(recipe, ingredients);
      return [recipe.name, recipe.category, recipe.price, Math.round(result.cost), `${result.foodCost.toFixed(1)}%`, Math.round(result.margin)];
    })];
    const csv = rows.map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "nempo-hpp-report.csv";
    anchor.click();
    URL.revokeObjectURL(url);
    notify("Laporan HPP berhasil diekspor.");
  }

  const recipeResults = useMemo(() => recipes.map((recipe) => ({ recipe, result: calculateRecipe(recipe, ingredients) })), [ingredients, recipes]);
  const activeRecipe = recipes.find((recipe) => recipe.id === selectedRecipeId) ?? recipes[0];
  const activeResult = activeRecipe ? calculateRecipe(activeRecipe, ingredients) : { cost: 0, foodCost: 0, margin: 0, marginPercent: 0 };
  const averageFoodCost = recipeResults.length ? recipeResults.reduce((sum, entry) => sum + entry.result.foodCost, 0) / recipeResults.length : 0;
  const filteredIngredients = ingredients.filter((ingredient) => `${ingredient.name} ${ingredient.category} ${ingredient.supplier}`.toLowerCase().includes(query.trim().toLowerCase()));
  const highCostRecipes = [...recipeResults].sort((a, b) => b.result.foodCost - a.result.foodCost);
  const lowStockIngredients = ingredients.filter((ingredient) => ingredient.stock < 2);

  return (
    <Layout>
      <SEO title="HPP Control Demo — Digi Nempo" description="Demo HPP Digi Nempo untuk menghitung biaya bahan, food cost, margin, dan simulasi harga jual." keywords="HPP, food cost, harga pokok penjualan, margin, resep, Digi Nempo" path="/digital-services/hpp" />
      <main className="nempo-demo-green nempo-hpp-preview min-h-screen bg-[#f4f7f7] text-[#183b43]">
        <div className="mx-auto max-w-[1480px] px-3 py-5 sm:px-6 lg:px-8 lg:py-8">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <Link href="/digital-services/super-app?module=hpp" className="inline-flex items-center gap-2 text-[10px] font-black text-[#648084] hover:text-[#0f766e]"><ArrowLeft className="h-3.5 w-3.5" /> Kembali ke Business Super App</Link>
            <div className="flex items-center gap-2 text-[10px] font-semibold text-[#8aa1a3]"><span className="h-2 w-2 rounded-full bg-[#1db49f]" /> Demo workspace · data simulasi</div>
          </div>
          <div className="overflow-hidden rounded-[26px] border border-[#dcebea] bg-white shadow-[0_24px_70px_rgba(20,74,77,0.1)]">
            <div className="flex min-h-[780px] flex-col lg:flex-row">
              <aside className="hidden w-[232px] shrink-0 bg-[#123f47] p-4 text-white lg:flex lg:flex-col">
                <div className="flex items-center gap-2.5 border-b border-white/10 px-2 pb-5"><div className="grid h-9 w-9 place-items-center rounded-xl bg-[#0f9b8e]"><Calculator className="h-4 w-4" /></div><div><p className="text-xs font-black">Nempo HPP Control</p><p className="mt-0.5 text-[9px] font-semibold text-white/45">Kopi Nempo · Garut</p></div></div>
                <div className="px-2 pt-6"><p className="text-[9px] font-black uppercase tracking-[0.16em] text-[#72cfc4]">Cost control</p><nav className="mt-3 space-y-1">{navItems.map(({ id, label, icon: Icon }) => <button key={id} type="button" onClick={() => setActiveView(id)} className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[10px] font-black transition-colors ${activeView === id ? "bg-white text-[#0f766e]" : "text-white/60 hover:bg-white/10 hover:text-white"}`}><Icon className="h-4 w-4" />{label}{id === "recipes" && <span className="ml-auto rounded-full bg-[#8bd6cc] px-1.5 py-0.5 text-[8px] text-[#123f47]">{recipes.length}</span>}</button>)}</nav></div>
                 <div className="mt-auto rounded-2xl bg-white/10 p-3.5"><p className="text-[9px] font-black uppercase tracking-[0.14em] text-[#8bd6cc]">Terhubung ke operasional</p><p className="mt-2 text-[11px] font-bold leading-4 text-white">Biaya resep membaca harga bahan dari Dapur Stock untuk menjaga margin tetap aktual.</p><div className="mt-3 flex flex-wrap gap-x-3 gap-y-2"><Link href="/digital-services/dapur-stock" className="inline-flex items-center gap-1 text-[10px] font-black text-[#a2e7df]">Buka Dapur Stock <ArrowRight className="h-3 w-3" /></Link><Link href="/digital-services/super-app" className="inline-flex items-center gap-1 text-[10px] font-black text-[#a2e7df]">Business OS <ArrowRight className="h-3 w-3" /></Link></div></div>
              </aside>
              <section className="min-w-0 flex-1 bg-[#f8fbfb]">
                <div className="border-b border-[#e3eeed] bg-white px-4 py-4 sm:px-6"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div><p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#0f9b8e]">Kopi Nempo · Cost control</p><h1 className="mt-1 text-xl font-black tracking-tight text-[#183b43]">{navItems.find((item) => item.id === activeView)?.label}</h1><p className="mt-1 text-[11px] font-medium text-[#8aa1a3]">Pahami biaya per porsi sebelum menentukan harga jual dan promo.</p></div><div className="flex flex-wrap items-center gap-2"><button type="button" onClick={() => setActiveView("simulator")} className="inline-flex items-center gap-1.5 rounded-xl border border-[#dcebea] bg-white px-3 py-2.5 text-[10px] font-black text-[#648084] hover:border-[#b9ded8] hover:text-[#0f766e]"><Target className="h-3.5 w-3.5" /> Simulasi harga</button><button type="button" onClick={() => setRecipeModal("new")} className="inline-flex items-center gap-1.5 rounded-xl bg-[#0f766e] px-3 py-2.5 text-[10px] font-black text-white shadow-sm shadow-teal-800/20 hover:bg-[#0b625c]"><Plus className="h-3.5 w-3.5" /> Tambah resep</button><button type="button" onClick={resetDemo} className="inline-flex items-center gap-1.5 rounded-xl border border-[#dcebea] bg-white px-3 py-2.5 text-[10px] font-black text-[#648084] hover:border-[#b9ded8] hover:text-[#0f766e]"><RefreshCcw className="h-3.5 w-3.5" /> Reset</button></div></div></div>
                <div className="flex gap-1 overflow-x-auto border-b border-[#e3eeed] bg-white px-4 py-2 lg:hidden">{navItems.map(({ id, label, icon: Icon }) => <button key={id} type="button" onClick={() => setActiveView(id)} className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-[10px] font-black ${activeView === id ? "bg-[#e6f6f3] text-[#0f766e]" : "text-[#82999b]"}`}><Icon className="h-3 w-3" />{label}</button>)}</div>
                <div className="p-4 sm:p-6">
                  {activeView === "overview" && <HppOverview recipes={recipeResults} averageFoodCost={averageFoodCost} lowStockIngredients={lowStockIngredients} onView={setActiveView} onEditRecipe={(recipe) => setRecipeModal(recipe)} onSimulate={(recipe) => { setSelectedRecipeId(recipe.id); setActiveView("simulator"); }} />}
                  {activeView === "recipes" && <RecipeView recipes={recipeResults} query={query} setQuery={setQuery} onAdd={() => setRecipeModal("new")} onEdit={(recipe) => setRecipeModal(recipe)} onSimulate={(recipe) => { setSelectedRecipeId(recipe.id); setActiveView("simulator"); }} />}
                  {activeView === "ingredients" && <IngredientView ingredients={filteredIngredients} query={query} setQuery={setQuery} onEdit={setIngredientModal} />}
                  {activeView === "simulator" && activeRecipe && <SimulatorView recipes={recipes} ingredients={ingredients} selectedRecipeId={selectedRecipeId} setSelectedRecipeId={setSelectedRecipeId} activeResult={activeResult} />}
                  {activeView === "reports" && <ReportView recipes={recipeResults} onExport={exportReport} />}
                </div>
              </section>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between px-1 text-[10px] font-semibold text-[#92a7a9]"><span>Data simulasi untuk kebutuhan presentasi customer.</span><span className="hidden items-center gap-1 sm:inline-flex"><History className="h-3 w-3" /> HPP diperbarui dari data bahan aktif</span></div>
        </div>
        {recipeModal && <RecipeModal recipe={recipeModal === "new" ? null : recipeModal} ingredients={ingredients} onClose={() => setRecipeModal(null)} onSubmit={saveRecipe} />}
        {ingredientModal && <IngredientModal ingredient={ingredientModal} onClose={() => setIngredientModal(null)} onSubmit={saveIngredient} />}
        {toast && <div role="status" className="fixed bottom-6 left-1/2 z-[80] flex max-w-[calc(100%-2rem)] -translate-x-1/2 items-center gap-2 rounded-full bg-[#123f47] px-4 py-3 text-xs font-bold text-white shadow-xl"><Check className="h-4 w-4 text-[#8bd6cc]" /> {toast}</div>}
      </main>
    </Layout>
  );
}

function HppOverview({ recipes, averageFoodCost, lowStockIngredients, onView, onEditRecipe, onSimulate }: { recipes: Array<{ recipe: Recipe; result: ReturnType<typeof calculateRecipe> }>; averageFoodCost: number; lowStockIngredients: Ingredient[]; onView: (view: HppView) => void; onEditRecipe: (recipe: Recipe) => void; onSimulate: (recipe: Recipe) => void }) {
  const bestMargin = [...recipes].sort((a, b) => b.result.marginPercent - a.result.marginPercent)[0];
  const attentionRecipe = [...recipes].sort((a, b) => b.result.foodCost - a.result.foodCost)[0];
  return <div className="space-y-4"><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"><MetricCard icon={CircleDollarSign} label="Rata-rata food cost" value={`${averageFoodCost.toFixed(1)}%`} detail="Target sehat 25–35%" tone={averageFoodCost <= 35 ? "teal" : "amber"} /><MetricCard icon={TrendingUp} label="Margin rata-rata" value={`${(100 - averageFoodCost).toFixed(1)}%`} detail="Sebelum biaya operasional" tone="blue" /><MetricCard icon={BookOpen} label="Resep aktif" value={`${recipes.filter((entry) => entry.recipe.status === "Aktif").length} menu`} detail="Dari database resep" tone="violet" /><MetricCard icon={CircleAlert} label="Bahan perlu dicek" value={`${lowStockIngredients.length} item`} detail={lowStockIngredients.length ? "Terhubung ke Dapur Stock" : "Semua aman"} tone="amber" /></div><div className="grid gap-4 xl:grid-cols-[1.15fr_.85fr]"><section className="rounded-2xl border border-[#e3eeed] bg-white p-4 sm:p-5"><div className="flex items-start justify-between gap-3"><div><p className="text-[9px] font-black uppercase tracking-[0.16em] text-[#0f9b8e]">Menu paling sehat</p><h2 className="mt-2 text-lg font-black text-[#244950]">Margin lebih mudah dikendalikan.</h2><p className="mt-1 text-[10px] leading-5 text-[#94a8aa]">Bandingkan biaya bahan dan harga jual sebelum membuat promo atau mengubah porsi.</p></div><Gauge className="h-5 w-5 text-[#0f766e]" /></div><div className="mt-5 space-y-2">{recipes.slice(0, 3).map(({ recipe, result }) => <button key={recipe.id} type="button" onClick={() => onEditRecipe(recipe)} className="flex w-full items-center gap-3 rounded-xl border border-[#edf3f2] p-3 text-left hover:border-[#b9ded8] hover:bg-[#fbfefe]"><span className="grid h-9 w-9 place-items-center rounded-xl bg-[#e6f6f3] text-[#0f766e]"><UtensilsCrossed className="h-4 w-4" /></span><div className="min-w-0 flex-1"><p className="truncate text-[10px] font-black text-[#365b60]">{recipe.name}</p><p className="mt-1 text-[9px] font-semibold text-[#94a8aa]">{recipe.category} · HPP {rupiah(result.cost)}</p></div><div className="text-right"><p className="text-[10px] font-black text-[#365b60]">{result.foodCost.toFixed(1)}% food cost</p><p className="mt-1 text-[9px] font-bold text-[#0f766e]">{rupiah(result.margin)} margin</p></div><Pencil className="h-3.5 w-3.5 text-[#9eb4b5]" /></button>)}</div></section><section className="rounded-2xl border border-[#e3eeed] bg-[#123f47] p-5 text-white"><div className="flex items-start justify-between"><div><p className="text-[9px] font-black uppercase tracking-[0.14em] text-[#8bd6cc]">HPP insight</p><h2 className="mt-2 text-lg font-black leading-tight">Harga jual berbasis biaya.</h2></div><Sparkles className="h-5 w-5 text-[#8bd6cc]" /></div><p className="mt-3 text-[10px] leading-5 text-white/60">{attentionRecipe ? `${attentionRecipe.recipe.name} memiliki food cost tertinggi ${attentionRecipe.result.foodCost.toFixed(1)}%. Cek takaran atau simulasi harga agar margin tetap sehat.` : "Tambahkan resep untuk melihat insight biaya."}</p><div className="mt-5 grid grid-cols-2 gap-2"><div className="rounded-xl bg-white/10 p-3"><p className="text-[9px] font-semibold text-white/55">Margin terbaik</p><p className="mt-1 text-xl font-black">{bestMargin?.result.marginPercent.toFixed(1) ?? 0}%</p></div><div className="rounded-xl bg-white/10 p-3"><p className="text-[9px] font-semibold text-white/55">Bahan terpantau</p><p className="mt-1 text-xl font-black">{lowStockIngredients.length ? `${lowStockIngredients.length} alert` : "Aman"}</p></div></div><button type="button" onClick={() => attentionRecipe && onSimulate(attentionRecipe.recipe)} className="mt-5 flex items-center gap-1.5 text-[10px] font-black text-[#a2e7df]">Simulasikan menu prioritas <ArrowRight className="h-3 w-3" /></button></section></div><div className="grid gap-4 lg:grid-cols-2"><section className="rounded-2xl border border-[#e3eeed] bg-white p-4 sm:p-5"><div className="flex items-center justify-between"><div><h2 className="text-sm font-black text-[#244950]">Alur data HPP</h2><p className="mt-1 text-[10px] text-[#94a8aa]">Sumber biaya yang dipakai sistem</p></div><Link href="/digital-services/dapur-stock" className="text-[10px] font-black text-[#0f766e]">Buka stok <ArrowRight className="ml-1 inline h-3 w-3" /></Link></div><div className="mt-4 grid gap-2 sm:grid-cols-3"><FlowCard icon={Warehouse} title="Dapur Stock" detail="Harga bahan" /><FlowCard icon={BookOpen} title="Resep" detail="Takaran standar" /><FlowCard icon={Calculator} title="HPP" detail="Margin & harga" /></div></section><section className="rounded-2xl border border-[#e3eeed] bg-white p-4 sm:p-5"><div className="flex items-center justify-between"><div><h2 className="text-sm font-black text-[#244950]">Quick action</h2><p className="mt-1 text-[10px] text-[#94a8aa]">Perbarui cost control dalam beberapa langkah</p></div><Settings2 className="h-4 w-4 text-[#0f766e]" /></div><div className="mt-4 grid grid-cols-2 gap-2"><button type="button" onClick={() => onView("recipes")} className="rounded-xl bg-[#e6f6f3] p-3 text-left text-[10px] font-black text-[#0f766e]">Kelola resep <ArrowRight className="ml-1 inline h-3 w-3" /></button><button type="button" onClick={() => onView("reports")} className="rounded-xl bg-[#f4f9f8] p-3 text-left text-[10px] font-black text-[#648084]">Lihat laporan <ArrowRight className="ml-1 inline h-3 w-3" /></button></div></section></div></div>;
}

function RecipeView({ recipes, query, setQuery, onAdd, onEdit, onSimulate }: { recipes: Array<{ recipe: Recipe; result: ReturnType<typeof calculateRecipe> }>; query: string; setQuery: (value: string) => void; onAdd: () => void; onEdit: (recipe: Recipe) => void; onSimulate: (recipe: Recipe) => void }) {
  const filtered = recipes.filter(({ recipe }) => recipe.name.toLowerCase().includes(query.trim().toLowerCase()));
  return <div className="space-y-4"><div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><SectionIntro eyebrow="Recipe costing" title="Menu & resep" description="Hitung HPP per porsi, food cost, dan margin setiap menu dengan komponen bahan yang terukur." /><button type="button" onClick={onAdd} className="inline-flex items-center gap-1.5 self-start rounded-xl bg-[#0f766e] px-3 py-2.5 text-[10px] font-black text-white hover:bg-[#0b625c]"><Plus className="h-3.5 w-3.5" /> Tambah resep</button></div><div className="rounded-2xl border border-[#e3eeed] bg-white p-4"><div className="relative max-w-sm"><Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#9aadaf]" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari nama menu..." className="w-full rounded-xl border border-[#dcebea] py-2.5 pl-9 pr-3 text-xs font-semibold text-[#365b60] outline-none focus:border-[#0f766e]" /></div></div><div className="grid gap-3 md:grid-cols-2">{filtered.map(({ recipe, result }) => <article key={recipe.id} className="rounded-2xl border border-[#e3eeed] bg-white p-4 sm:p-5"><div className="flex items-start justify-between gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-[#e6f6f3] text-[#0f766e]"><BookOpen className="h-4 w-4" /></span><StatusPill label={recipe.status} /></div><h2 className="mt-4 text-sm font-black text-[#365b60]">{recipe.name}</h2><p className="mt-1 text-[10px] font-semibold text-[#94a8aa]">{recipe.category} · {recipe.components.length} komponen</p><div className="mt-5 grid grid-cols-3 gap-2"><MiniMetric label="HPP" value={rupiah(result.cost)} /><MiniMetric label="Food cost" value={`${result.foodCost.toFixed(1)}%`} /><MiniMetric label="Margin" value={rupiah(result.margin)} /></div><div className="mt-4 flex items-center justify-between border-t border-[#edf3f2] pt-3"><span className="text-[10px] font-bold text-[#648084]">Harga jual <strong className="text-[#365b60]">{rupiah(recipe.price)}</strong></span><div className="flex gap-2"><button type="button" onClick={() => onSimulate(recipe)} className="rounded-lg bg-[#e6f6f3] px-2.5 py-2 text-[9px] font-black text-[#0f766e]">Simulasi</button><button type="button" onClick={() => onEdit(recipe)} aria-label={`Edit ${recipe.name}`} className="grid h-8 w-8 place-items-center rounded-lg border border-[#dcebea] text-[#648084] hover:border-[#b9ded8] hover:text-[#0f766e]"><Pencil className="h-3.5 w-3.5" /></button></div></div></article>)}</div></div>;
}

function IngredientView({ ingredients, query, setQuery, onEdit }: { ingredients: Ingredient[]; query: string; setQuery: (value: string) => void; onEdit: (ingredient: Ingredient) => void }) {
  return <div className="space-y-4"><SectionIntro eyebrow="Cost components" title="Komponen bahan" description="Pantau harga satuan bahan yang menjadi dasar perhitungan HPP setiap resep." /><div className="rounded-2xl border border-[#e3eeed] bg-white p-4"><div className="relative max-w-sm"><Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#9aadaf]" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari bahan atau supplier..." className="w-full rounded-xl border border-[#dcebea] py-2.5 pl-9 pr-3 text-xs font-semibold text-[#365b60] outline-none focus:border-[#0f766e]" /></div><div className="mt-4 overflow-x-auto"><table className="w-full min-w-[620px] text-left"><thead><tr className="border-b border-[#edf3f2] text-[9px] font-black uppercase tracking-[0.12em] text-[#94a8aa]"><th className="pb-3">Bahan</th><th className="pb-3">Kategori</th><th className="pb-3">Harga satuan</th><th className="pb-3">Stok</th><th className="pb-3">Supplier</th><th className="pb-3" /></tr></thead><tbody className="divide-y divide-[#edf3f2]">{ingredients.map((ingredient) => <tr key={ingredient.id}><td className="py-3"><p className="text-[10px] font-black text-[#365b60]">{ingredient.name}</p><p className="mt-1 text-[9px] text-[#94a8aa]">per {ingredient.unit}</p></td><td className="py-3 text-[10px] font-semibold text-[#648084]">{ingredient.category}</td><td className="py-3 text-[10px] font-black text-[#0f766e]">{rupiah(ingredient.cost)}</td><td className="py-3"><span className={`text-[10px] font-black ${ingredient.stock < 2 ? "text-[#b97820]" : "text-[#365b60]"}`}>{formatQty(ingredient.stock)} {ingredient.unit}</span></td><td className="py-3 text-[10px] font-semibold text-[#648084]">{ingredient.supplier}</td><td className="py-3 text-right"><button type="button" onClick={() => onEdit(ingredient)} className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-[9px] font-black text-[#0f766e] hover:bg-[#e6f6f3]"><Pencil className="h-3 w-3" /> Edit</button></td></tr>)}</tbody></table>{!ingredients.length && <p className="py-8 text-center text-xs font-semibold text-[#8aa1a3]">Bahan tidak ditemukan.</p>}</div></div></div>;
}

function SimulatorView({ recipes, ingredients, selectedRecipeId, setSelectedRecipeId, activeResult }: { recipes: Recipe[]; ingredients: Ingredient[]; selectedRecipeId: string; setSelectedRecipeId: (id: string) => void; activeResult: ReturnType<typeof calculateRecipe> }) {
  const [price, setPrice] = useState("");
  const [targetMargin, setTargetMargin] = useState("65");
  const selectedRecipe = recipes.find((recipe) => recipe.id === selectedRecipeId) ?? recipes[0];
  const currentPrice = Number(price) || selectedRecipe?.price || 0;
  const margin = currentPrice ? ((currentPrice - activeResult.cost) / currentPrice) * 100 : 0;
  const recommendedPrice = activeResult.cost / Math.max(0.01, 1 - Number(targetMargin) / 100);
  return <div className="space-y-4"><SectionIntro eyebrow="Pricing laboratory" title="Simulasi harga jual" description="Uji harga jual, target margin, dan dampak perubahan biaya bahan sebelum diterapkan ke menu." /><div className="grid gap-4 lg:grid-cols-[.8fr_1.2fr]"><section className="rounded-2xl border border-[#e3eeed] bg-white p-4 sm:p-5"><Field label="Pilih menu"><select value={selectedRecipe?.id} onChange={(event) => { setSelectedRecipeId(event.target.value); setPrice(""); }} className={fieldClass}>{recipes.map((recipe) => <option key={recipe.id} value={recipe.id}>{recipe.name}</option>)}</select></Field><div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-1"><Field label="Harga jual simulasi"><input type="number" min="0" value={price} placeholder={String(selectedRecipe?.price)} onChange={(event) => setPrice(event.target.value)} className={fieldClass} /></Field><Field label="Target margin"><select value={targetMargin} onChange={(event) => setTargetMargin(event.target.value)} className={fieldClass}><option value="55">55% margin</option><option value="60">60% margin</option><option value="65">65% margin</option><option value="70">70% margin</option></select></Field></div><div className="mt-5 rounded-xl border border-dashed border-[#b9ded8] bg-[#f4fbfa] p-3"><p className="flex items-center gap-2 text-[10px] font-black text-[#08766f]"><Target className="h-3.5 w-3.5" /> Rekomendasi harga</p><p className="mt-1 text-2xl font-black text-[#183b43]">{rupiah(Math.ceil(recommendedPrice / 500) * 500)}</p><p className="mt-1 text-[9px] leading-4 text-[#6d878a]">Dibulatkan ke kelipatan Rp500 untuk mencapai margin {targetMargin}%.</p></div></section><section className="rounded-2xl border border-[#e3eeed] bg-white p-4 sm:p-5"><div className="flex items-start justify-between"><div><p className="text-[9px] font-black uppercase tracking-[0.16em] text-[#0f9b8e]">Breakdown {selectedRecipe?.name}</p><h2 className="mt-2 text-lg font-black text-[#244950]">Angka yang bisa dijelaskan ke tim.</h2></div><Calculator className="h-5 w-5 text-[#0f766e]" /></div><div className="mt-5 grid gap-3 sm:grid-cols-3"><MetricCard icon={Package} label="HPP / porsi" value={rupiah(activeResult.cost)} detail="Bahan + kemasan" tone="teal" /><MetricCard icon={TrendingUp} label="Margin simulasi" value={`${margin.toFixed(1)}%`} detail={margin >= 60 ? "Margin sehat" : "Perlu ditinjau"} tone="blue" /><MetricCard icon={Gauge} label="Gross profit" value={rupiah(currentPrice - activeResult.cost)} detail={`Harga ${rupiah(currentPrice)}`} tone="violet" /></div><div className="mt-5 space-y-2">{selectedRecipe?.components.map((component) => { const ingredient = ingredients.find((entry) => entry.id === component.ingredientId); const subtotal = (ingredient?.cost ?? 0) * component.quantity; return <div key={component.ingredientId} className="flex items-center gap-3 rounded-xl border border-[#edf3f2] p-3"><span className="grid h-8 w-8 place-items-center rounded-lg bg-[#e6f6f3] text-[#0f766e]"><Package className="h-3.5 w-3.5" /></span><div className="min-w-0 flex-1"><p className="truncate text-[10px] font-black text-[#365b60]">{ingredient?.name}</p><p className="mt-1 text-[9px] text-[#94a8aa]">{formatQty(component.quantity)} {ingredient?.unit} · {rupiah(ingredient?.cost ?? 0)} / {ingredient?.unit}</p></div><span className="text-[10px] font-black text-[#365b60]">{rupiah(subtotal)}</span></div>; })}</div></section></div></div>;
}

function ReportView({ recipes, onExport }: { recipes: Array<{ recipe: Recipe; result: ReturnType<typeof calculateRecipe> }>; onExport: () => void }) {
  const bars = [48, 66, 54, 78, 70, 88, 82];
  return <div className="space-y-4"><div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><SectionIntro eyebrow="Cost intelligence" title="Laporan margin" description="Gunakan tren food cost dan margin untuk mengevaluasi menu, promo, dan harga jual." /><button type="button" onClick={onExport} className="inline-flex items-center gap-1.5 self-start rounded-xl border border-[#dcebea] bg-white px-3 py-2.5 text-[10px] font-black text-[#648084] hover:border-[#b9ded8] hover:text-[#0f766e]"><Download className="h-3.5 w-3.5" /> Export CSV</button></div><div className="grid gap-3 sm:grid-cols-3"><MetricCard icon={BarChart3} label="Menu dianalisis" value={`${recipes.length} menu`} detail="Database aktif" tone="teal" /><MetricCard icon={Target} label="Target food cost" value="25–35%" detail="Standar operasional" tone="blue" /><MetricCard icon={TrendingUp} label="Margin tertinggi" value={`${Math.max(...recipes.map((entry) => entry.result.marginPercent), 0).toFixed(1)}%`} detail="Dari menu saat ini" tone="violet" /></div><div className="grid gap-4 lg:grid-cols-[1.15fr_.85fr]"><section className="rounded-2xl border border-[#e3eeed] bg-white p-4 sm:p-5"><div className="flex items-center justify-between"><div><h2 className="text-sm font-black text-[#244950]">Tren margin</h2><p className="mt-1 text-[10px] text-[#94a8aa]">Simulasi performa 7 periode terakhir</p></div><TrendingUp className="h-4 w-4 text-[#0f766e]" /></div><div className="mt-6 flex h-48 items-end gap-2 border-b border-[#edf3f2] px-1">{bars.map((value, index) => <div key={index} className="flex flex-1 flex-col items-center gap-2"><div className={`w-full max-w-[34px] rounded-t-lg ${index === bars.length - 1 ? "bg-[#0f766e]" : "bg-[#a9dcd6]"}`} style={{ height: `${value}%` }} /><span className="text-[9px] font-bold text-[#a2b3b4]">M{index + 1}</span></div>)}</div></section><section className="rounded-2xl border border-[#e3eeed] bg-white p-4 sm:p-5"><div className="flex items-center justify-between"><div><h2 className="text-sm font-black text-[#244950]">Perlu perhatian</h2><p className="mt-1 text-[10px] text-[#94a8aa]">Food cost di atas target</p></div><CircleAlert className="h-4 w-4 text-[#b97820]" /></div><div className="mt-4 space-y-2">{recipes.filter((entry) => entry.result.foodCost > 35).map(({ recipe, result }) => <div key={recipe.id} className="flex items-center justify-between rounded-xl bg-[#fffaf1] p-3"><span className="truncate pr-3 text-[10px] font-black text-[#365b60]">{recipe.name}</span><span className="shrink-0 text-[10px] font-black text-[#b97820]">{result.foodCost.toFixed(1)}%</span></div>)}{!recipes.some((entry) => entry.result.foodCost > 35) && <p className="rounded-xl bg-[#f4fbfa] p-3 text-[10px] font-semibold text-[#648084]">Semua menu berada di bawah 35% food cost.</p>}</div></section></div></div>;
}

function RecipeModal({ recipe, ingredients, onClose, onSubmit }: { recipe: Recipe | null; ingredients: Ingredient[]; onClose: () => void; onSubmit: (recipe: Recipe) => void }) {
  const [name, setName] = useState(recipe?.name ?? "");
  const [category, setCategory] = useState(recipe?.category ?? "Minuman kopi");
  const [price, setPrice] = useState(String(recipe?.price ?? 25000));
  const [status, setStatus] = useState<Recipe["status"]>(recipe?.status ?? "Draft");
  const [components, setComponents] = useState<RecipeComponent[]>(recipe?.components ?? [{ ingredientId: ingredients[0]?.id ?? "", quantity: 0.02 }, { ingredientId: ingredients[1]?.id ?? "", quantity: 0.1 }]);
  function updateComponent(index: number, patch: Partial<RecipeComponent>) {
    setComponents((current) => current.map((component, componentIndex) => componentIndex === index ? { ...component, ...patch } : component));
  }
  return <ModalShell title={recipe ? `Edit ${recipe.name}` : "Tambah resep"} eyebrow="Recipe costing" onClose={onClose}><form onSubmit={(event) => { event.preventDefault(); if (!name.trim()) return; onSubmit({ id: recipe?.id ?? `recipe-${Date.now()}`, name: name.trim(), category, price: Number(price) || 0, portions: 1, components: components.filter((component) => component.ingredientId && component.quantity > 0), status }); }} className="space-y-4"><div className="grid gap-4 sm:grid-cols-2"><Field label="Nama menu"><input required autoFocus value={name} onChange={(event) => setName(event.target.value)} placeholder="Contoh: Matcha latte" className={fieldClass} /></Field><Field label="Kategori"><select value={category} onChange={(event) => setCategory(event.target.value)} className={fieldClass}><option>Minuman kopi</option><option>Minuman non-kopi</option><option>Makanan utama</option><option>Paket sarapan</option><option>Pelengkap</option></select></Field></div><div className="grid gap-4 sm:grid-cols-2"><Field label="Harga jual"><input required type="number" min="0" value={price} onChange={(event) => setPrice(event.target.value)} className={fieldClass} /></Field><Field label="Status"><select value={status} onChange={(event) => setStatus(event.target.value as Recipe["status"])} className={fieldClass}><option>Aktif</option><option>Draft</option></select></Field></div><div><div className="mb-2 flex items-center justify-between"><p className="text-[9px] font-black uppercase tracking-[0.1em] text-[#6d878a]">Komponen per porsi</p><button type="button" onClick={() => setComponents((current) => [...current, { ingredientId: ingredients[0]?.id ?? "", quantity: 0.01 }])} className="text-[9px] font-black text-[#0f766e]">+ Tambah bahan</button></div><div className="space-y-2">{components.map((component, index) => <div key={`${component.ingredientId}-${index}`} className="grid grid-cols-[1fr_100px_28px] gap-2"><select value={component.ingredientId} onChange={(event) => updateComponent(index, { ingredientId: event.target.value })} className={fieldClass}>{ingredients.map((ingredient) => <option key={ingredient.id} value={ingredient.id}>{ingredient.name}</option>)}</select><input type="number" min="0" step="0.001" value={component.quantity} onChange={(event) => updateComponent(index, { quantity: Number(event.target.value) })} className={fieldClass} /><button type="button" onClick={() => setComponents((current) => current.filter((_, componentIndex) => componentIndex !== index))} aria-label="Hapus komponen" className="grid place-items-center rounded-xl border border-[#dcebea] text-[#9aadaf] hover:text-[#b75c54]"><X className="h-3.5 w-3.5" /></button></div>)}</div></div><ModalActions onClose={onClose} submitLabel={recipe ? "Simpan perubahan" : "Simpan resep"} /></form></ModalShell>;
}

function IngredientModal({ ingredient, onClose, onSubmit }: { ingredient: Ingredient; onClose: () => void; onSubmit: (ingredient: Ingredient) => void }) {
  const [cost, setCost] = useState(String(ingredient.cost));
  const [stock, setStock] = useState(String(ingredient.stock));
  return <ModalShell title={`Edit ${ingredient.name}`} eyebrow="Cost components" onClose={onClose}><form onSubmit={(event) => { event.preventDefault(); onSubmit({ ...ingredient, cost: Number(cost) || 0, stock: Number(stock) || 0 }); }} className="space-y-4"><div className="rounded-xl bg-[#f4f9f8] p-3"><p className="text-[10px] font-black text-[#365b60]">{ingredient.category} · per {ingredient.unit}</p><p className="mt-1 text-[9px] text-[#94a8aa]">Perubahan harga akan memengaruhi HPP seluruh resep yang memakai bahan ini.</p></div><Field label={`Harga beli per ${ingredient.unit}`}><input required type="number" min="0" value={cost} onChange={(event) => setCost(event.target.value)} className={fieldClass} /></Field><Field label={`Stok tersedia (${ingredient.unit})`}><input required type="number" min="0" step="0.001" value={stock} onChange={(event) => setStock(event.target.value)} className={fieldClass} /></Field><ModalActions onClose={onClose} submitLabel="Simpan biaya" /></form></ModalShell>;
}

function ModalShell({ title, eyebrow, onClose, children }: { title: string; eyebrow: string; onClose: () => void; children: ReactNode }) {
  return <div className="fixed inset-0 z-[75] flex items-end justify-center bg-[#183b43]/40 p-0 backdrop-blur-sm sm:items-center sm:p-5"><div role="dialog" aria-modal="true" className="w-full max-w-2xl rounded-t-[26px] bg-white p-5 shadow-2xl sm:rounded-[26px] sm:p-6"><div className="flex items-start justify-between"><div><p className="text-[9px] font-black uppercase tracking-[0.18em] text-[#0f766e]">{eyebrow}</p><h2 className="mt-2 text-xl font-black text-[#183b43]">{title}</h2></div><button type="button" onClick={onClose} aria-label="Tutup modal" className="grid h-8 w-8 place-items-center rounded-full bg-[#f4f9f8] text-[#6d878a] hover:bg-[#e6f6f3] hover:text-[#0f766e]"><X className="h-4 w-4" /></button></div><div className="mt-6">{children}</div></div></div>;
}

function ModalActions({ onClose, submitLabel }: { onClose: () => void; submitLabel: string }) {
  return <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end"><button type="button" onClick={onClose} className="rounded-xl px-4 py-2.5 text-[10px] font-black text-[#6d878a] hover:bg-[#f4f9f8]">Batal</button><button type="submit" className="rounded-xl bg-[#0f766e] px-4 py-2.5 text-[10px] font-black text-white hover:bg-[#0b625c]">{submitLabel}</button></div>;
}

function SectionIntro({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return <div><p className="text-[9px] font-black uppercase tracking-[0.16em] text-[#0f9b8e]">{eyebrow}</p><h2 className="mt-1.5 text-lg font-black tracking-tight text-[#244950]">{title}</h2><p className="mt-1 text-[10px] leading-5 text-[#94a8aa]">{description}</p></div>;
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className="block"><span className="mb-1.5 block text-[9px] font-black uppercase tracking-[0.1em] text-[#6d878a]">{label}</span>{children}</label>;
}

function MetricCard({ icon: Icon, label, value, detail, tone }: { icon: typeof Package; label: string; value: string; detail: string; tone: "teal" | "blue" | "violet" | "amber" }) {
  const styles = { teal: "bg-[#e6f6f3] text-[#0f766e]", blue: "bg-[#e3eff8] text-[#3a6b9b]", violet: "bg-[#ece9f8] text-[#7362a6]", amber: "bg-[#fff1dc] text-[#a56c2b]" };
  return <div className="rounded-2xl border border-[#e3eeed] bg-white p-4"><div className="flex items-center justify-between"><span className={`grid h-9 w-9 place-items-center rounded-xl ${styles[tone]}`}><Icon className="h-4 w-4" /></span><CircleCheck className={`h-3.5 w-3.5 ${tone === "teal" ? "text-[#0f9b8e]" : "text-[#9cb3b5]"}`} /></div><p className="mt-4 text-[10px] font-bold text-[#94a8aa]">{label}</p><p className="mt-1 text-2xl font-black tracking-tight text-[#244950]">{value}</p><p className="mt-1 text-[9px] font-bold text-[#0f766e]">{detail}</p></div>;
}

function MiniMetric({ label, value }: { label: string; value: string }) {
  return <div className="rounded-lg bg-[#f4f9f8] p-2"><p className="text-[8px] font-semibold text-[#94a8aa]">{label}</p><p className="mt-1 text-[12px] font-black text-[#365b60]">{value}</p></div>;
}

function FlowCard({ icon: Icon, title, detail }: { icon: typeof Package; title: string; detail: string }) {
  return <div className="rounded-xl border border-[#edf3f2] bg-[#fbfefe] p-3"><Icon className="h-4 w-4 text-[#0f766e]" /><p className="mt-3 text-[10px] font-black text-[#365b60]">{title}</p><p className="mt-1 text-[9px] font-semibold text-[#94a8aa]">{detail}</p></div>;
}

function StatusPill({ label }: { label: Recipe["status"] }) {
  return <span className={`rounded-full px-2 py-1 text-[8px] font-black ${label === "Aktif" ? "bg-[#e6f6f3] text-[#0f766e]" : "bg-[#f2f4f4] text-[#6d878a]"}`}>{label}</span>;
}

const fieldClass = "w-full rounded-xl border border-[#dcebea] bg-[#fbfdfd] px-3 py-2.5 text-xs font-semibold text-[#365b60] outline-none placeholder:text-[#9bb1b3] focus:border-[#0f766e] focus:ring-2 focus:ring-[#b9ded8]";