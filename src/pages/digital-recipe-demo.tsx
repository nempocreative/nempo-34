import { Layout } from "@/components/layout";
import { SEO } from "@/components/seo";
import { DigitalPreviewGate } from "@/components/digital-preview-gate";
import { Link } from "@/lib/wouter";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  BookOpen,
  Calculator,
  Check,
  CheckCircle2,
  CircleAlert,
  ClipboardCheck,
  Clock3,
  Copy,
  Download,
  Eye,
  EyeOff,
  FileText,
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
  Tag,
  Target,
  Trash2,
  TrendingUp,
  UtensilsCrossed,
  Warehouse,
  X,
} from "lucide-react";
import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import "./digital-demo-super-app.css";

type RecipeView = "overview" | "catalog" | "ingredients" | "production" | "versions" | "reports";
type RecipeStatus = "Aktif" | "Draft" | "Arsip";
type IngredientCategory = "Bahan baku" | "Dairy" | "Bumbu" | "Kemasan";

type RecipeIngredient = {
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
  description: string;
  price: number;
  portions: number;
  components: RecipeComponent[];
  status: RecipeStatus;
  version: string;
  updatedAt: string;
  owner: string;
  tags: string[];
};

type ProductionRun = {
  id: string;
  recipeName: string;
  servings: number;
  cost: number;
  operator: string;
  date: string;
  status: "Selesai" | "Menunggu";
};

const navItems: Array<{ id: RecipeView; label: string; icon: typeof LayoutDashboard }> = [
  { id: "overview", label: "Ringkasan resep", icon: LayoutDashboard },
  { id: "catalog", label: "Katalog resep", icon: BookOpen },
  { id: "ingredients", label: "Bahan & takaran", icon: Package },
  { id: "production", label: "Simulasi produksi", icon: UtensilsCrossed },
  { id: "versions", label: "Riwayat versi", icon: History },
  { id: "reports", label: "Laporan resep", icon: BarChart3 },
];

const categoryOptions = ["Semua kategori", "Minuman kopi", "Makanan utama", "Paket sarapan", "Saus & pelengkap"];
const statusOptions: Array<"Semua status" | RecipeStatus> = ["Semua status", "Aktif", "Draft", "Arsip"];

const initialIngredients: RecipeIngredient[] = [
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
    description: "Espresso, susu segar, dan gula aren khas Kopi Nempo untuk satu sajian.",
    price: 28000,
    portions: 1,
    components: [
      { ingredientId: "ingredient-coffee", quantity: 0.018 },
      { ingredientId: "ingredient-milk", quantity: 0.12 },
      { ingredientId: "ingredient-palm-sugar", quantity: 0.025 },
      { ingredientId: "ingredient-cup", quantity: 1 },
    ],
    status: "Aktif",
    version: "v3",
    updatedAt: "Hari ini, 08:40",
    owner: "Nadia Putri",
    tags: ["Best seller", "Minuman"],
  },
  {
    id: "recipe-nasi-ayam",
    name: "Nasi Ayam Sambal",
    category: "Makanan utama",
    description: "Nasi hangat, ayam crispy, lalapan, dan sambal rumah dengan takaran standar.",
    price: 32000,
    portions: 1,
    components: [
      { ingredientId: "ingredient-chicken", quantity: 0.14 },
      { ingredientId: "ingredient-rice", quantity: 0.18 },
      { ingredientId: "ingredient-chili", quantity: 0.03 },
    ],
    status: "Aktif",
    version: "v2",
    updatedAt: "Kemarin, 16:20",
    owner: "Asep",
    tags: ["Lunch", "Dapur"],
  },
  {
    id: "recipe-croissant",
    name: "Croissant Latte Set",
    category: "Paket sarapan",
    description: "Croissant butter dan kopi susu untuk paket sarapan cepat.",
    price: 39000,
    portions: 1,
    components: [
      { ingredientId: "ingredient-croissant", quantity: 1 },
      { ingredientId: "ingredient-coffee", quantity: 0.018 },
      { ingredientId: "ingredient-milk", quantity: 0.1 },
      { ingredientId: "ingredient-cup", quantity: 1 },
    ],
    status: "Aktif",
    version: "v4",
    updatedAt: "12 Sep 2026",
    owner: "Rina",
    tags: ["Bundle", "Pagi"],
  },
  {
    id: "recipe-sambal",
    name: "Sambal Rumah",
    category: "Saus & pelengkap",
    description: "Sambal produksi batch untuk menjaga rasa konsisten di semua cabang.",
    price: 8000,
    portions: 10,
    components: [{ ingredientId: "ingredient-chili", quantity: 0.4 }],
    status: "Draft",
    version: "v1",
    updatedAt: "10 Sep 2026",
    owner: "Dani",
    tags: ["Batch", "Eksperimen"],
  },
];

const initialProductionRuns: ProductionRun[] = [
  { id: "production-01", recipeName: "Es Kopi Aren", servings: 40, cost: 295200, operator: "Rina", date: "Hari ini, 08:40", status: "Selesai" },
  { id: "production-02", recipeName: "Nasi Ayam Sambal", servings: 24, cost: 243840, operator: "Asep", date: "Kemarin, 16:20", status: "Selesai" },
  { id: "production-03", recipeName: "Croissant Latte Set", servings: 18, cost: 342360, operator: "Sari", date: "12 Sep 2026", status: "Selesai" },
];

const RECIPE_PREVIEW_PASSWORD = "nemposukses";
const RECIPE_PREVIEW_ACCESS_KEY = "nempo_recipe_preview_access";
const rupiah = (value: number) => `Rp${Math.round(value).toLocaleString("id-ID")}`;
const formatQty = (value: number) => value.toLocaleString("id-ID", { maximumFractionDigits: 3 });

function recipeCost(recipe: Recipe, ingredients: RecipeIngredient[]) {
  const batchCost = recipe.components.reduce((total, component) => {
    const ingredient = ingredients.find((entry) => entry.id === component.ingredientId);
    return total + (ingredient?.cost ?? 0) * component.quantity;
  }, 0);
  const cost = batchCost / Math.max(recipe.portions, 1);
  const foodCost = recipe.price ? (cost / recipe.price) * 100 : 0;
  return { batchCost, cost, foodCost, margin: recipe.price - cost, marginPercent: 100 - foodCost };
}

function RecipePreviewGate({ onUnlock }: { onUnlock: () => void }) {
  return <DigitalPreviewGate title="Nempo Recipe OS" description="Masukkan password untuk membuka katalog resep, takaran standar, simulasi produksi, dan riwayat versi." onUnlock={onUnlock}>{null}</DigitalPreviewGate>;

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (password === RECIPE_PREVIEW_PASSWORD) {
      localStorage.setItem(RECIPE_PREVIEW_ACCESS_KEY, "1");
      onUnlock();
    } else setError(true);
  }

  return (
    <main className="nempo-demo-green nempo-recipe-gate flex min-h-[100dvh] items-center justify-center bg-[#f4f7f7] px-5 text-[#183b43]">
      <div className="w-full max-w-md border border-[#dcebea] bg-[#fbfdfd] p-6 shadow-[0_22px_70px_rgba(24,59,67,0.12)] sm:p-8">
        <div className="mb-7 flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#0f766e] text-white shadow-lg shadow-teal-800/20"><BookOpen className="h-5 w-5" /></div>
          <div><p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#0f9b8e]">Live preview</p><h1 className="mt-1 text-xl font-black tracking-tight text-[#183b43]">Nempo Recipe OS</h1></div>
        </div>
        <p className="text-sm leading-6 text-[#648084]">Masukkan password untuk membuka katalog resep, takaran standar, simulasi produksi, dan riwayat versi.</p>
        <form onSubmit={submit} className="mt-6 space-y-3">
          <input type="text" name="username" autoComplete="username" value="recipe-preview" readOnly tabIndex={-1} aria-hidden="true" className="sr-only" />
          <label className={`flex items-center gap-3 rounded-xl border bg-white px-3.5 py-3 transition-colors ${error ? "border-[#b75c54] bg-[#fff8f5]" : "border-[#dcebea] focus-within:border-[#0f766e]"}`}>
            <Settings2 className={`h-4 w-4 shrink-0 ${error ? "text-[#b75c54]" : "text-[#7da5a2]"}`} />
            <span className="sr-only">Password live preview Resep</span>
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

export default function DigitalRecipeDemoPage() {
  const [unlocked, setUnlocked] = useState(false);
  if (!unlocked) return <RecipePreviewGate onUnlock={() => setUnlocked(true)} />;
  return <RecipeWorkspace />;
}

function RecipeWorkspace() {
  const [activeView, setActiveView] = useState<RecipeView>("overview");
  const [recipes, setRecipes] = useState(initialRecipes);
  const [ingredients, setIngredients] = useState(initialIngredients);
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("Semua kategori");
  const [statusFilter, setStatusFilter] = useState<(typeof statusOptions)[number]>("Semua status");
  const [selectedRecipeId, setSelectedRecipeId] = useState(initialRecipes[0].id);
  const [productionRuns, setProductionRuns] = useState(initialProductionRuns);
  const [recipeModal, setRecipeModal] = useState<Recipe | "new" | null>(null);
  const [ingredientModal, setIngredientModal] = useState<RecipeIngredient | null>(null);
  const [detailRecipe, setDetailRecipe] = useState<Recipe | null>(null);
  const [batchServings, setBatchServings] = useState("20");
  const [toast, setToast] = useState<string | null>(null);

  function notify(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(null), 2500);
  }

  function resetDemo() {
    setActiveView("overview");
    setRecipes(initialRecipes);
    setIngredients(initialIngredients);
    setQuery("");
    setCategoryFilter("Semua kategori");
    setStatusFilter("Semua status");
    setSelectedRecipeId(initialRecipes[0].id);
    setProductionRuns(initialProductionRuns);
    setRecipeModal(null);
    setIngredientModal(null);
    setDetailRecipe(null);
    setBatchServings("20");
    notify("Demo resep dikembalikan ke data awal.");
  }

  function saveRecipe(recipe: Recipe) {
    setRecipes((current) => current.some((entry) => entry.id === recipe.id) ? current.map((entry) => entry.id === recipe.id ? recipe : entry) : [recipe, ...current]);
    setSelectedRecipeId(recipe.id);
    setRecipeModal(null);
    notify(`${recipe.name} berhasil disimpan.`);
  }

  function duplicateRecipe(recipe: Recipe) {
    const duplicate = { ...recipe, id: `recipe-${Date.now()}`, name: `${recipe.name} · Duplikat`, status: "Draft" as RecipeStatus, version: "v1", updatedAt: "Baru saja", owner: "Anda", tags: [...recipe.tags, "Draft"] };
    setRecipes((current) => [duplicate, ...current]);
    setSelectedRecipeId(duplicate.id);
    notify(`${duplicate.name} dibuat sebagai draft.`);
  }

  function changeStatus(recipe: Recipe, status: RecipeStatus) {
    setRecipes((current) => current.map((entry) => entry.id === recipe.id ? { ...entry, status, updatedAt: "Baru saja", version: `v${Number(entry.version.replace("v", "")) + 1}` } : entry));
    notify(`${recipe.name} dipindahkan ke status ${status}.`);
  }

  function saveIngredient(ingredient: RecipeIngredient) {
    setIngredients((current) => current.map((entry) => entry.id === ingredient.id ? ingredient : entry));
    setIngredientModal(null);
    notify(`Biaya ${ingredient.name} diperbarui.`);
  }

  function produceBatch() {
    const recipe = recipes.find((entry) => entry.id === selectedRecipeId);
    const servings = Math.max(1, Number(batchServings) || 1);
    if (!recipe) return;
    const requirements = recipe.components.map((component) => {
      const ingredient = ingredients.find((entry) => entry.id === component.ingredientId);
      return { ingredient, required: component.quantity / Math.max(recipe.portions, 1) * servings };
    });
    const shortage = requirements.find(({ ingredient, required }) => ingredient && required > ingredient.stock);
    if (shortage?.ingredient) {
      notify(`Stok ${shortage.ingredient.name} belum cukup untuk ${servings} porsi.`);
      return;
    }
    setIngredients((current) => current.map((ingredient) => {
      const requirement = requirements.find((entry) => entry.ingredient?.id === ingredient.id);
      return requirement ? { ...ingredient, stock: ingredient.stock - requirement.required } : ingredient;
    }));
    setProductionRuns((current) => [
      {
        id: `production-${Date.now()}`,
        recipeName: recipe.name,
        servings,
        cost: activeResult.cost * servings,
        operator: "Anda",
        date: "Baru saja",
        status: "Selesai",
      },
      ...current,
    ]);
    notify(`${servings} porsi ${recipe.name} dicatat sebagai produksi.`);
  }

  function exportReport() {
    const rows = [["Resep", "Kategori", "Versi", "HPP/porsi", "Harga jual", "Food cost", "Margin"], ...recipes.map((recipe) => {
      const result = recipeCost(recipe, ingredients);
      return [recipe.name, recipe.category, recipe.version, Math.round(result.cost), recipe.price, `${result.foodCost.toFixed(1)}%`, Math.round(result.margin)];
    })];
    const csv = rows.map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "nempo-recipe-report.csv";
    anchor.click();
    URL.revokeObjectURL(url);
    notify("Laporan resep berhasil diekspor.");
  }

  const recipeResults = useMemo(() => recipes.map((recipe) => ({ recipe, result: recipeCost(recipe, ingredients) })), [ingredients, recipes]);
  const visibleRecipes = recipeResults.filter(({ recipe }) => {
    const needle = query.trim().toLowerCase();
    return (!needle || `${recipe.name} ${recipe.category} ${recipe.tags.join(" ")}`.toLowerCase().includes(needle))
      && (categoryFilter === "Semua kategori" || recipe.category === categoryFilter)
      && (statusFilter === "Semua status" || recipe.status === statusFilter);
  });
  const activeRecipe = recipes.find((recipe) => recipe.id === selectedRecipeId) ?? recipes[0];
  const activeResult = activeRecipe ? recipeCost(activeRecipe, ingredients) : { batchCost: 0, cost: 0, foodCost: 0, margin: 0, marginPercent: 0 };
  const lowStockIngredients = ingredients.filter((ingredient) => ingredient.stock < 2);
  const attentionRecipes = recipeResults.filter(({ result }) => result.foodCost > 35);
  const pageTitle = navItems.find((item) => item.id === activeView)?.label ?? "Ringkasan resep";

  return (
    <Layout>
      <SEO title="Resep Demo — Digi Nempo" description="Demo Resep Digi Nempo untuk takaran standar, kontrol versi, biaya per porsi, dan simulasi produksi." keywords="resep digital, recipe management, takaran standar, food cost, Digi Nempo" path="/digital-services/resep" />
      <main className="nempo-demo-green nempo-recipe-preview min-h-screen bg-[#f4f7f7] text-[#183b43]">
        <div className="mx-auto max-w-[1480px] px-3 py-5 sm:px-6 lg:px-8 lg:py-8">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <Link href="/digital-services/super-app?module=resep" className="inline-flex items-center gap-2 text-[10px] font-black text-[#648084] hover:text-[#0f766e]"><ArrowLeft className="h-3.5 w-3.5" /> Kembali ke Business Super App</Link>
            <div className="flex items-center gap-2 text-[10px] font-semibold text-[#8aa1a3]"><span className="h-2 w-2 rounded-full bg-[#1db49f]" /> Demo workspace · data simulasi</div>
          </div>
           <div className="overflow-hidden rounded-[26px] border border-[#dcebea] bg-white shadow-[0_24px_70px_rgba(20,74,77,0.1)]">
            <div className="flex min-h-[790px] flex-col lg:flex-row">
              <aside className="hidden w-[242px] shrink-0 bg-[#123f47] p-4 text-white lg:flex lg:flex-col">
                <div className="flex items-center gap-2.5 border-b border-white/10 px-2 pb-5"><div className="grid h-9 w-9 place-items-center rounded-xl bg-[#0f9b8e]"><BookOpen className="h-4 w-4" /></div><div><p className="text-xs font-black">Nempo Recipe OS</p><p className="mt-0.5 text-[9px] font-semibold text-white/45">Kopi Nempo · Garut</p></div></div>
                <div className="px-2 pt-6"><p className="text-[9px] font-black uppercase tracking-[0.16em] text-[#72cfc4]">Recipe management</p><nav className="mt-3 space-y-1">{navItems.map(({ id, label, icon: Icon }) => <button key={id} type="button" onClick={() => setActiveView(id)} className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[10px] font-black transition-colors ${activeView === id ? "bg-white text-[#0f766e]" : "text-white/60 hover:bg-white/10 hover:text-white"}`}><Icon className="h-4 w-4" />{label}{id === "catalog" && <span className="ml-auto rounded-full bg-[#8bd6cc] px-1.5 py-0.5 text-[8px] text-[#123f47]">{recipes.length}</span>}</button>)}</nav></div>
                <div className="mt-auto rounded-2xl bg-white/10 p-3.5"><p className="text-[9px] font-black uppercase tracking-[0.14em] text-[#8bd6cc]">Super App connected</p><p className="mt-2 text-[11px] font-bold leading-4 text-white">Resep menjadi sumber takaran untuk HPP dan pemakaian produksi dapur.</p><div className="mt-3 flex flex-wrap gap-x-3 gap-y-2"><Link href="/digital-services/hpp" className="inline-flex items-center gap-1 text-[10px] font-black text-[#a2e7df]">HPP Control <ArrowRight className="h-3 w-3" /></Link><Link href="/digital-services/dapur-stock" className="inline-flex items-center gap-1 text-[10px] font-black text-[#a2e7df]">Dapur Stock <ArrowRight className="h-3 w-3" /></Link></div></div>
              </aside>
               <section className="min-w-0 flex-1 bg-[#f8fbfb]">
                <div className="border-b border-[#e3eeed] bg-white px-4 py-4 sm:px-6"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div><p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#0f9b8e]">Kopi Nempo · Recipe management</p><h1 className="mt-1 text-xl font-black tracking-tight text-[#183b43]">{pageTitle}</h1><p className="mt-1 text-[11px] font-medium text-[#8aa1a3]">Jaga rasa, takaran, dan biaya produksi tetap konsisten di setiap lokasi.</p></div><div className="flex flex-wrap items-center gap-2"><button type="button" onClick={() => setActiveView("production")} className="inline-flex items-center gap-1.5 rounded-xl border border-[#dcebea] bg-white px-3 py-2.5 text-[10px] font-black text-[#648084] hover:border-[#b9ded8] hover:text-[#0f766e]"><ClipboardCheck className="h-3.5 w-3.5" /> Produksi</button><button type="button" onClick={() => setRecipeModal("new")} className="inline-flex items-center gap-1.5 rounded-xl bg-[#0f766e] px-3 py-2.5 text-[10px] font-black text-white shadow-sm shadow-teal-800/20 hover:bg-[#0b625c]"><Plus className="h-3.5 w-3.5" /> Tambah resep</button><button type="button" onClick={resetDemo} className="inline-flex items-center gap-1.5 rounded-xl border border-[#dcebea] bg-white px-3 py-2.5 text-[10px] font-black text-[#648084] hover:border-[#b9ded8] hover:text-[#0f766e]"><RefreshCcw className="h-3.5 w-3.5" /> Reset</button></div></div></div>
                 <div className="flex flex-wrap items-center gap-2 border-b border-[#e3eeed] bg-[#fbfdfd] px-4 py-2.5 sm:px-6">
                   <span className="mr-1 text-[9px] font-black uppercase tracking-[0.14em] text-[#9aadaf]">Terhubung</span>
                   <Link href="/digital-services/hpp" className="inline-flex items-center gap-1.5 rounded-lg bg-[#e6f6f3] px-2.5 py-1.5 text-[9px] font-black text-[#0f766e] transition-colors hover:bg-[#d4efeb]"><Calculator className="h-3 w-3" /> HPP <span className="font-semibold text-[#5ca69f]">· biaya</span></Link>
                   <Link href="/digital-services/dapur-stock" className="inline-flex items-center gap-1.5 rounded-lg bg-[#e6f6f3] px-2.5 py-1.5 text-[9px] font-black text-[#0f766e] transition-colors hover:bg-[#d4efeb]"><Warehouse className="h-3 w-3" /> Dapur Stock <span className="font-semibold text-[#5ca69f]">· bahan</span></Link>
                   <Link href="/digital-services/super-app" className="ml-auto inline-flex items-center gap-1 text-[9px] font-black text-[#648084] transition-colors hover:text-[#0f766e]"><LayoutDashboard className="h-3 w-3" /> Business OS <ArrowRight className="h-3 w-3" /></Link>
                 </div>
                <div className="flex gap-1 overflow-x-auto border-b border-[#e3eeed] bg-white px-4 py-2 lg:hidden">{navItems.map(({ id, label, icon: Icon }) => <button key={id} type="button" onClick={() => setActiveView(id)} className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-[10px] font-black ${activeView === id ? "bg-[#e6f6f3] text-[#0f766e]" : "text-[#82999b]"}`}><Icon className="h-3 w-3" />{label}</button>)}</div>
                <div className="p-4 sm:p-6">
                  {activeView === "overview" && <RecipeOverview recipes={recipeResults} lowStockIngredients={lowStockIngredients} attentionRecipes={attentionRecipes} onView={setActiveView} onOpen={(recipe) => setDetailRecipe(recipe)} onSimulate={(recipe) => { setSelectedRecipeId(recipe.id); setActiveView("production"); }} />}
                  {activeView === "catalog" && <RecipeCatalog recipes={visibleRecipes} query={query} setQuery={setQuery} categoryFilter={categoryFilter} setCategoryFilter={setCategoryFilter} statusFilter={statusFilter} setStatusFilter={setStatusFilter} onAdd={() => setRecipeModal("new")} onOpen={setDetailRecipe} onEdit={(recipe) => setRecipeModal(recipe)} onDuplicate={duplicateRecipe} onStatus={changeStatus} />}
                  {activeView === "ingredients" && <IngredientView ingredients={ingredients} query={query} setQuery={setQuery} onEdit={setIngredientModal} />}
                   {activeView === "production" && activeRecipe && <ProductionView recipes={recipes} ingredients={ingredients} productionRuns={productionRuns} selectedRecipeId={selectedRecipeId} setSelectedRecipeId={setSelectedRecipeId} batchServings={batchServings} setBatchServings={setBatchServings} activeResult={activeResult} onProduce={produceBatch} />}
                  {activeView === "versions" && <VersionView recipes={recipes} onOpen={setDetailRecipe} onEdit={(recipe) => setRecipeModal(recipe)} />}
                  {activeView === "reports" && <RecipeReports recipes={recipeResults} onExport={exportReport} />}
                </div>
              </section>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between px-1 text-[10px] font-semibold text-[#92a7a9]"><span>Data simulasi untuk kebutuhan presentasi customer.</span><span className="hidden items-center gap-1 sm:inline-flex"><Clock3 className="h-3 w-3" /> Takaran terhubung ke HPP & Dapur Stock</span></div>
        </div>
        {recipeModal && <RecipeModal recipe={recipeModal === "new" ? null : recipeModal} ingredients={ingredients} onClose={() => setRecipeModal(null)} onSubmit={saveRecipe} />}
        {ingredientModal && <IngredientModal ingredient={ingredientModal} onClose={() => setIngredientModal(null)} onSubmit={saveIngredient} />}
        {detailRecipe && <RecipeDetailDrawer recipe={detailRecipe} ingredients={ingredients} onClose={() => setDetailRecipe(null)} onEdit={() => { setRecipeModal(detailRecipe); setDetailRecipe(null); }} onSimulate={() => { setSelectedRecipeId(detailRecipe.id); setActiveView("production"); setDetailRecipe(null); }} />}
        {toast && <div role="status" className="fixed bottom-6 left-1/2 z-[80] flex max-w-[calc(100%-2rem)] -translate-x-1/2 items-center gap-2 rounded-full bg-[#123f47] px-4 py-3 text-xs font-bold text-white shadow-xl"><Check className="h-4 w-4 text-[#8bd6cc]" /> {toast}</div>}
      </main>
    </Layout>
  );
}

function RecipeOverview({ recipes, lowStockIngredients, attentionRecipes, onView, onOpen, onSimulate }: { recipes: Array<{ recipe: Recipe; result: ReturnType<typeof recipeCost> }>; lowStockIngredients: RecipeIngredient[]; attentionRecipes: Array<{ recipe: Recipe; result: ReturnType<typeof recipeCost> }>; onView: (view: RecipeView) => void; onOpen: (recipe: Recipe) => void; onSimulate: (recipe: Recipe) => void }) {
  const activeCount = recipes.filter(({ recipe }) => recipe.status === "Aktif").length;
  const averageCost = recipes.length ? recipes.reduce((sum, entry) => sum + entry.result.foodCost, 0) / recipes.length : 0;
  return <div className="space-y-4"><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"><MetricCard icon={BookOpen} label="Total resep" value={`${recipes.length} menu`} detail={`${activeCount} resep aktif`} tone="teal" /><MetricCard icon={Calculator} label="Rata-rata food cost" value={`${averageCost.toFixed(1)}%`} detail="Target sehat 25–35%" tone={averageCost <= 35 ? "blue" : "amber"} /><MetricCard icon={Target} label="Perlu review" value={`${attentionRecipes.length} menu`} detail={attentionRecipes.length ? "Food cost di atas target" : "Semua sesuai target"} tone="amber" /><MetricCard icon={Package} label="Bahan menipis" value={`${lowStockIngredients.length} item`} detail="Terhubung ke Dapur Stock" tone="violet" /></div><div className="grid gap-4 xl:grid-cols-[1.12fr_.88fr]"><section className="rounded-2xl border border-[#e3eeed] bg-white p-4 sm:p-5"><div className="flex items-start justify-between gap-3"><div><p className="text-[9px] font-black uppercase tracking-[0.16em] text-[#0f9b8e]">Recipe health</p><h2 className="mt-2 text-lg font-black text-[#244950]">Takaran yang siap dipakai tim.</h2><p className="mt-1 text-[10px] leading-5 text-[#94a8aa]">Setiap resep punya komponen, biaya, versi, dan status publikasi yang jelas.</p></div><Gauge className="h-5 w-5 text-[#0f766e]" /></div><div className="mt-5 space-y-2">{recipes.slice(0, 3).map(({ recipe, result }) => <button key={recipe.id} type="button" onClick={() => onOpen(recipe)} className="flex w-full items-center gap-3 rounded-xl border border-[#edf3f2] p-3 text-left hover:border-[#b9ded8] hover:bg-[#fbfefe]"><span className="grid h-9 w-9 place-items-center rounded-xl bg-[#e6f6f3] text-[#0f766e]"><UtensilsCrossed className="h-4 w-4" /></span><div className="min-w-0 flex-1"><p className="truncate text-[10px] font-black text-[#365b60]">{recipe.name}</p><p className="mt-1 text-[9px] font-semibold text-[#94a8aa]">{recipe.category} · {recipe.components.length} komponen</p></div><div className="text-right"><p className="text-[10px] font-black text-[#365b60]">{result.foodCost.toFixed(1)}% food cost</p><p className="mt-1 text-[9px] font-bold text-[#0f766e]">{rupiah(result.cost)} / porsi</p></div><ArrowRight className="h-3.5 w-3.5 text-[#9eb4b5]" /></button>)}</div></section><section className="rounded-2xl border border-[#e3eeed] bg-[#123f47] p-5 text-white"><div className="flex items-start justify-between"><div><p className="text-[9px] font-black uppercase tracking-[0.14em] text-[#8bd6cc]">Recipe insight</p><h2 className="mt-2 text-lg font-black leading-tight">Rasa konsisten, keputusan lebih cepat.</h2></div><Sparkles className="h-5 w-5 text-[#8bd6cc]" /></div><p className="mt-3 text-[10px] leading-5 text-white/60">{attentionRecipes[0] ? `${attentionRecipes[0].recipe.name} memiliki food cost ${attentionRecipes[0].result.foodCost.toFixed(1)}%. Review takaran atau harga jual sebelum membuat promo.` : "Semua resep berada pada rentang biaya yang sehat. Tim bisa produksi berdasarkan versi standar."}</p><div className="mt-5 grid grid-cols-2 gap-2"><div className="rounded-xl bg-white/10 p-3"><p className="text-[9px] font-semibold text-white/55">Versi aktif</p><p className="mt-1 text-xl font-black">{activeCount}</p></div><div className="rounded-xl bg-white/10 p-3"><p className="text-[9px] font-semibold text-white/55">Bahan terpantau</p><p className="mt-1 text-xl font-black">{ingredientsLabel(lowStockIngredients.length)}</p></div></div><button type="button" onClick={() => attentionRecipes[0] ? onSimulate(attentionRecipes[0].recipe) : onView("catalog")} className="mt-5 flex items-center gap-1.5 text-[10px] font-black text-[#a2e7df]">{attentionRecipes[0] ? "Review menu prioritas" : "Buka katalog resep"} <ArrowRight className="h-3 w-3" /></button></section></div><div className="grid gap-4 lg:grid-cols-3"><QuickLink icon={BookOpen} title="Kelola katalog" detail="Resep, status, dan komponen" onClick={() => onView("catalog")} /><QuickLink icon={ClipboardCheck} title="Simulasi produksi" detail="Hitung kebutuhan per batch" onClick={() => onView("production")} /><QuickLink icon={History} title="Riwayat versi" detail="Lacak perubahan takaran" onClick={() => onView("versions")} /></div></div>;
}

function ingredientsLabel(count: number) { return count ? `${count} alert` : "Aman"; }

function RecipeCatalog({ recipes, query, setQuery, categoryFilter, setCategoryFilter, statusFilter, setStatusFilter, onAdd, onOpen, onEdit, onDuplicate, onStatus }: { recipes: Array<{ recipe: Recipe; result: ReturnType<typeof recipeCost> }>; query: string; setQuery: (value: string) => void; categoryFilter: string; setCategoryFilter: (value: string) => void; statusFilter: (typeof statusOptions)[number]; setStatusFilter: (value: (typeof statusOptions)[number]) => void; onAdd: () => void; onOpen: (recipe: Recipe) => void; onEdit: (recipe: Recipe) => void; onDuplicate: (recipe: Recipe) => void; onStatus: (recipe: Recipe, status: RecipeStatus) => void }) {
  return <div className="space-y-4"><div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><SectionIntro eyebrow="Recipe library" title="Katalog resep" description="Simpan resep standar, komponen bahan, harga jual, dan status publikasi dalam satu ruang kerja." /><button type="button" onClick={onAdd} className="inline-flex items-center gap-1.5 self-start rounded-xl bg-[#0f766e] px-3 py-2.5 text-[10px] font-black text-white hover:bg-[#0b625c]"><Plus className="h-3.5 w-3.5" /> Tambah resep</button></div><div className="rounded-2xl border border-[#e3eeed] bg-white p-4"><div className="flex flex-col gap-3 lg:flex-row"><div className="relative flex-1"><Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#9aadaf]" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari nama resep, kategori, atau tag..." className="w-full rounded-xl border border-[#dcebea] py-2.5 pl-9 pr-3 text-xs font-semibold text-[#365b60] outline-none focus:border-[#0f766e]" /></div><select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)} className={filterClass}>{categoryOptions.map((category) => <option key={category}>{category}</option>)}</select><select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as (typeof statusOptions)[number])} className={filterClass}>{statusOptions.map((status) => <option key={status}>{status}</option>)}</select></div></div><div className="grid gap-3 md:grid-cols-2">{recipes.map(({ recipe, result }) => <article key={recipe.id} className="rounded-2xl border border-[#e3eeed] bg-white p-4 sm:p-5"><div className="flex items-start justify-between gap-3"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-[#e6f6f3] text-[#0f766e]"><BookOpen className="h-4 w-4" /></span><div><p className="text-[9px] font-black uppercase tracking-[0.14em] text-[#0f9b8e]">{recipe.category}</p><h2 className="mt-1 text-sm font-black text-[#365b60]">{recipe.name}</h2></div></div><StatusPill label={recipe.status} /></div><p className="mt-3 line-clamp-2 text-[10px] leading-5 text-[#94a8aa]">{recipe.description}</p><div className="mt-4 flex flex-wrap gap-1.5">{recipe.tags.map((tag) => <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-[#f4f9f8] px-2 py-1 text-[8px] font-black text-[#648084]"><Tag className="h-2.5 w-2.5 text-[#0f766e]" />{tag}</span>)}</div><div className="mt-5 grid grid-cols-3 gap-2"><MiniMetric label="HPP / porsi" value={rupiah(result.cost)} /><MiniMetric label="Food cost" value={`${result.foodCost.toFixed(1)}%`} /><MiniMetric label="Yield" value={`${recipe.portions} porsi`} /></div><div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-[#edf3f2] pt-3"><span className="text-[10px] font-bold text-[#648084]">v{recipe.version.replace("v", "")} · {recipe.updatedAt}</span><div className="flex gap-1.5"><button type="button" onClick={() => onOpen(recipe)} className="grid h-8 w-8 place-items-center rounded-lg border border-[#dcebea] text-[#648084] hover:border-[#b9ded8] hover:text-[#0f766e]" aria-label={`Lihat ${recipe.name}`}><Eye className="h-3.5 w-3.5" /></button><button type="button" onClick={() => onEdit(recipe)} className="grid h-8 w-8 place-items-center rounded-lg border border-[#dcebea] text-[#648084] hover:border-[#b9ded8] hover:text-[#0f766e]" aria-label={`Edit ${recipe.name}`}><Pencil className="h-3.5 w-3.5" /></button><button type="button" onClick={() => onDuplicate(recipe)} className="grid h-8 w-8 place-items-center rounded-lg border border-[#dcebea] text-[#648084] hover:border-[#b9ded8] hover:text-[#0f766e]" aria-label={`Duplikat ${recipe.name}`}><Copy className="h-3.5 w-3.5" /></button><button type="button" onClick={() => onStatus(recipe, recipe.status === "Aktif" ? "Arsip" : "Aktif")} className="rounded-lg bg-[#e6f6f3] px-2.5 py-2 text-[9px] font-black text-[#0f766e]">{recipe.status === "Aktif" ? "Arsipkan" : "Publikasikan"}</button></div></div></article>)}</div>{!recipes.length && <EmptyState label="Resep tidak ditemukan. Coba ubah pencarian atau filter." />}</div>;
}

function IngredientView({ ingredients, query, setQuery, onEdit }: { ingredients: RecipeIngredient[]; query: string; setQuery: (value: string) => void; onEdit: (ingredient: RecipeIngredient) => void }) {
  const visible = ingredients.filter((ingredient) => `${ingredient.name} ${ingredient.category} ${ingredient.supplier}`.toLowerCase().includes(query.trim().toLowerCase()));
  return <div className="space-y-4"><SectionIntro eyebrow="Recipe components" title="Bahan & takaran" description="Pantau harga bahan dan stok yang dipakai semua resep agar biaya produksi selalu punya sumber data yang jelas." /><div className="rounded-2xl border border-[#e3eeed] bg-white p-4 sm:p-5"><div className="relative max-w-md"><Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#9aadaf]" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari bahan, kategori, atau supplier..." className="w-full rounded-xl border border-[#dcebea] py-2.5 pl-9 pr-3 text-xs font-semibold text-[#365b60] outline-none focus:border-[#0f766e]" /></div><div className="mt-4 overflow-x-auto"><table className="w-full min-w-[760px] text-left"><thead><tr className="border-b border-[#edf3f2] text-[9px] font-black uppercase tracking-[0.12em] text-[#94a8aa]"><th className="pb-3">Bahan</th><th className="pb-3">Kategori</th><th className="pb-3">Harga satuan</th><th className="pb-3">Stok saat ini</th><th className="pb-3">Supplier</th><th className="pb-3" /></tr></thead><tbody className="divide-y divide-[#edf3f2]">{visible.map((ingredient) => <tr key={ingredient.id}><td className="py-3"><p className="text-[10px] font-black text-[#365b60]">{ingredient.name}</p><p className="mt-1 text-[9px] text-[#94a8aa]">per {ingredient.unit}</p></td><td className="py-3 text-[10px] font-semibold text-[#648084]">{ingredient.category}</td><td className="py-3 text-[10px] font-black text-[#0f766e]">{rupiah(ingredient.cost)}</td><td className="py-3"><span className={`text-[10px] font-black ${ingredient.stock < 2 ? "text-[#b97820]" : "text-[#365b60]"}`}>{formatQty(ingredient.stock)} {ingredient.unit}</span>{ingredient.stock < 2 && <span className="ml-2 rounded-full bg-[#fff1dd] px-2 py-1 text-[8px] font-black text-[#a56c2b]">Menipis</span>}</td><td className="py-3 text-[10px] font-semibold text-[#648084]">{ingredient.supplier}</td><td className="py-3 text-right"><button type="button" onClick={() => onEdit(ingredient)} className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-[9px] font-black text-[#0f766e] hover:bg-[#e6f6f3]"><Pencil className="h-3 w-3" /> Edit</button></td></tr>)}</tbody></table>{!visible.length && <EmptyState label="Bahan tidak ditemukan." />}</div></div></div>;
}

function ProductionView({ recipes, ingredients, productionRuns, selectedRecipeId, setSelectedRecipeId, batchServings, setBatchServings, activeResult, onProduce }: { recipes: Recipe[]; ingredients: RecipeIngredient[]; productionRuns: ProductionRun[]; selectedRecipeId: string; setSelectedRecipeId: (value: string) => void; batchServings: string; setBatchServings: (value: string) => void; activeResult: ReturnType<typeof recipeCost>; onProduce: () => void }) {
  const selectedRecipe = recipes.find((recipe) => recipe.id === selectedRecipeId) ?? recipes[0];
  const servings = Math.max(1, Number(batchServings) || 1);
  return <div className="space-y-4"><SectionIntro eyebrow="Production planning" title="Simulasi produksi" description="Hitung kebutuhan bahan untuk batch tertentu sebelum dapur mulai produksi." /><div className="grid gap-4 lg:grid-cols-[.78fr_1.22fr]"><section className="rounded-2xl border border-[#e3eeed] bg-white p-4 sm:p-5"><Field label="Pilih resep"><select value={selectedRecipe.id} onChange={(event) => setSelectedRecipeId(event.target.value)} className={fieldClass}>{recipes.map((recipe) => <option key={recipe.id} value={recipe.id}>{recipe.name} · {recipe.version}</option>)}</select></Field><div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-1"><Field label="Jumlah porsi produksi"><input type="number" min="1" value={batchServings} onChange={(event) => setBatchServings(event.target.value)} className={fieldClass} /></Field><div className="rounded-xl border border-[#b9ded8] bg-[#f4fbfa] p-3"><p className="text-[9px] font-black uppercase tracking-[0.12em] text-[#0f9b8e]">Estimasi biaya batch</p><p className="mt-1 text-2xl font-black text-[#183b43]">{rupiah(activeResult.cost * servings)}</p><p className="mt-1 text-[9px] text-[#6d878a]">{rupiah(activeResult.cost)} per porsi · yield standar {selectedRecipe.portions} porsi</p></div></div><button type="button" onClick={onProduce} className="mt-5 inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-[#0f766e] px-4 py-3 text-[10px] font-black text-white hover:bg-[#0b625c]"><ClipboardCheck className="h-3.5 w-3.5" /> Catat produksi</button></section><section className="rounded-2xl border border-[#e3eeed] bg-white p-4 sm:p-5"><div className="flex items-start justify-between"><div><p className="text-[9px] font-black uppercase tracking-[0.16em] text-[#0f9b8e]">Ingredient requirement</p><h2 className="mt-2 text-lg font-black text-[#244950]">{selectedRecipe.name}</h2><p className="mt-1 text-[10px] text-[#94a8aa]">Kebutuhan untuk {servings} porsi produksi.</p></div><UtensilsCrossed className="h-5 w-5 text-[#0f766e]" /></div><div className="mt-5 space-y-2">{selectedRecipe.components.map((component) => { const ingredient = ingredients.find((entry) => entry.id === component.ingredientId); const required = component.quantity / Math.max(selectedRecipe.portions, 1) * servings; const enough = (ingredient?.stock ?? 0) >= required; return <div key={component.ingredientId} className="flex items-center gap-3 rounded-xl border border-[#edf3f2] p-3"><span className={`grid h-8 w-8 place-items-center rounded-lg ${enough ? "bg-[#e6f6f3] text-[#0f766e]" : "bg-[#fff1dd] text-[#a56c2b]"}`}><Package className="h-3.5 w-3.5" /></span><div className="min-w-0 flex-1"><p className="truncate text-[10px] font-black text-[#365b60]">{ingredient?.name}</p><p className="mt-1 text-[9px] text-[#94a8aa]">Tersedia {formatQty(ingredient?.stock ?? 0)} {ingredient?.unit} · Butuh {formatQty(required)} {ingredient?.unit}</p></div><span className={`text-[9px] font-black ${enough ? "text-[#0f766e]" : "text-[#a56c2b]"}`}>{enough ? "Cukup" : "Restock"}</span></div>; })}</div></section></div><section className="rounded-2xl border border-[#e3eeed] bg-white p-4 sm:p-5"><div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start"><div><p className="text-[9px] font-black uppercase tracking-[0.16em] text-[#0f9b8e]">Production log</p><h2 className="mt-1 text-lg font-black text-[#244950]">Aktivitas produksi terbaru</h2><p className="mt-1 text-[10px] text-[#94a8aa]">Setiap batch mengurangi stok bahan dan tercatat untuk laporan operasional.</p></div><span className="inline-flex items-center gap-1.5 rounded-lg bg-[#e6f6f3] px-2.5 py-2 text-[9px] font-black text-[#0f766e]"><History className="h-3 w-3" /> {productionRuns.length} batch tercatat</span></div><div className="mt-4 overflow-x-auto"><table className="w-full min-w-[620px] text-left"><thead><tr className="border-b border-[#edf3f2] text-[9px] font-black uppercase tracking-[0.12em] text-[#94a8aa]"><th className="pb-3">Resep</th><th className="pb-3">Porsi</th><th className="pb-3">Estimasi biaya</th><th className="pb-3">Operator</th><th className="pb-3">Waktu</th><th className="pb-3 text-right">Status</th></tr></thead><tbody className="divide-y divide-[#edf3f2]">{productionRuns.slice(0, 5).map((run) => <tr key={run.id}><td className="py-3 text-[10px] font-black text-[#365b60]">{run.recipeName}</td><td className="py-3 text-[10px] font-semibold text-[#648084]">{run.servings} porsi</td><td className="py-3 text-[10px] font-black text-[#0f766e]">{rupiah(run.cost)}</td><td className="py-3 text-[10px] font-semibold text-[#648084]">{run.operator}</td><td className="py-3 text-[10px] font-semibold text-[#94a8aa]">{run.date}</td><td className="py-3 text-right"><span className="rounded-full bg-[#e6f6f3] px-2 py-1 text-[8px] font-black text-[#0f766e]">{run.status}</span></td></tr>)}</tbody></table></div></section></div>;
}

function VersionView({ recipes, onOpen, onEdit }: { recipes: Recipe[]; onOpen: (recipe: Recipe) => void; onEdit: (recipe: Recipe) => void }) {
  return <div className="space-y-4"><SectionIntro eyebrow="Recipe governance" title="Riwayat versi" description="Lacak siapa yang memperbarui resep, versi takaran yang dipakai, dan status publikasinya." /><div className="rounded-2xl border border-[#e3eeed] bg-white p-4 sm:p-5"><div className="space-y-2">{recipes.map((recipe) => <article key={recipe.id} className="flex flex-col gap-3 rounded-xl border border-[#edf3f2] p-4 sm:flex-row sm:items-center"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#e6f6f3] text-[#0f766e]"><History className="h-4 w-4" /></span><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h2 className="text-xs font-black text-[#365b60]">{recipe.name}</h2><StatusPill label={recipe.status} /></div><p className="mt-1 text-[9px] font-semibold text-[#94a8aa]">{recipe.version} · diperbarui {recipe.updatedAt} · oleh {recipe.owner}</p><p className="mt-2 text-[9px] text-[#648084]">{recipe.components.length} komponen · {recipe.portions} porsi per batch · {recipe.tags.join(" · ")}</p></div><div className="flex gap-1.5"><button type="button" onClick={() => onOpen(recipe)} className="inline-flex items-center gap-1 rounded-lg border border-[#dcebea] px-2.5 py-2 text-[9px] font-black text-[#648084] hover:border-[#b9ded8] hover:text-[#0f766e]"><Eye className="h-3 w-3" /> Detail</button><button type="button" onClick={() => onEdit(recipe)} className="inline-flex items-center gap-1 rounded-lg bg-[#e6f6f3] px-2.5 py-2 text-[9px] font-black text-[#0f766e]"><Pencil className="h-3 w-3" /> Edit</button></div></article>)}</div></div></div>;
}

function RecipeReports({ recipes, onExport }: { recipes: Array<{ recipe: Recipe; result: ReturnType<typeof recipeCost> }>; onExport: () => void }) {
  const bars = [48, 62, 55, 76, 68, 88, 82];
  const averageMargin = recipes.length ? recipes.reduce((sum, entry) => sum + entry.result.marginPercent, 0) / recipes.length : 0;
  return <div className="space-y-4"><div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><SectionIntro eyebrow="Recipe intelligence" title="Laporan resep" description="Gunakan data food cost, margin, dan tren perubahan untuk menjaga menu tetap sehat." /><button type="button" onClick={onExport} className="inline-flex items-center gap-1.5 self-start rounded-xl border border-[#dcebea] bg-white px-3 py-2.5 text-[10px] font-black text-[#648084] hover:border-[#b9ded8] hover:text-[#0f766e]"><Download className="h-3.5 w-3.5" /> Export CSV</button></div><div className="grid gap-3 sm:grid-cols-3"><MetricCard icon={BookOpen} label="Menu dianalisis" value={`${recipes.length} menu`} detail="Katalog aktif & draft" tone="teal" /><MetricCard icon={TrendingUp} label="Margin rata-rata" value={`${averageMargin.toFixed(1)}%`} detail="Sebelum biaya operasional" tone="blue" /><MetricCard icon={Target} label="Target food cost" value="25–35%" detail="Standar operasional" tone="violet" /></div><div className="grid gap-4 lg:grid-cols-[1.15fr_.85fr]"><section className="rounded-2xl border border-[#e3eeed] bg-white p-4 sm:p-5"><div className="flex items-center justify-between"><div><h2 className="text-sm font-black text-[#244950]">Tren kesehatan margin</h2><p className="mt-1 text-[10px] text-[#94a8aa]">Simulasi tujuh periode terakhir</p></div><BarChart3 className="h-4 w-4 text-[#0f766e]" /></div><div className="mt-6 flex h-48 items-end gap-2 border-b border-l border-[#edf3f2] px-1">{bars.map((value, index) => <div key={index} className="flex flex-1 flex-col items-center gap-2"><div className={`recipe-report-bar w-full max-w-[34px] rounded-t-lg ${index === bars.length - 1 ? "bg-[#0f766e]" : "bg-[#a9dcd6]"}`} style={{ height: `${value}%` }} /><span className="text-[9px] font-bold text-[#a2b3b4]">M{index + 1}</span></div>)}</div></section><section className="rounded-2xl border border-[#e3eeed] bg-white p-4 sm:p-5"><div className="flex items-center justify-between"><div><h2 className="text-sm font-black text-[#244950]">Menu perlu review</h2><p className="mt-1 text-[10px] text-[#94a8aa]">Food cost di atas target</p></div><CircleAlert className="h-4 w-4 text-[#b97820]" /></div><div className="mt-4 space-y-2">{recipes.filter((entry) => entry.result.foodCost > 35).map(({ recipe, result }) => <div key={recipe.id} className="flex items-center justify-between rounded-xl bg-[#fffaf1] p-3"><span className="truncate pr-3 text-[10px] font-black text-[#365b60]">{recipe.name}</span><span className="shrink-0 text-[10px] font-black text-[#b97820]">{result.foodCost.toFixed(1)}%</span></div>)}{!recipes.some((entry) => entry.result.foodCost > 35) && <p className="rounded-xl bg-[#f4fbfa] p-3 text-[10px] font-semibold text-[#648084]">Semua menu berada di bawah 35% food cost.</p>}</div></section></div></div>;
}

function RecipeDetailDrawer({ recipe, ingredients, onClose, onEdit, onSimulate }: { recipe: Recipe; ingredients: RecipeIngredient[]; onClose: () => void; onEdit: () => void; onSimulate: () => void }) {
  const result = recipeCost(recipe, ingredients);
  return <div className="fixed inset-0 z-[75] flex justify-end bg-[#123f47]/30 backdrop-blur-sm" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><aside role="dialog" aria-modal="true" className="h-full w-full max-w-md overflow-y-auto bg-white p-5 shadow-2xl sm:p-7"><div className="flex items-start justify-between"><div className="flex items-center gap-3"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#e6f6f3] text-[#0f766e]"><BookOpen className="h-5 w-5" /></span><div><p className="text-[9px] font-black uppercase tracking-[0.16em] text-[#0f9b8e]">Detail resep · {recipe.version}</p><h2 className="mt-1 text-xl font-black tracking-tight text-[#183b43]">{recipe.name}</h2><p className="mt-1 text-[10px] font-semibold text-[#94a8aa]">{recipe.category} · oleh {recipe.owner}</p></div></div><button type="button" onClick={onClose} aria-label="Tutup detail resep" className="grid h-8 w-8 place-items-center rounded-full bg-[#f4f9f8] text-[#6d878a] hover:text-[#0f766e]"><X className="h-4 w-4" /></button></div><p className="mt-5 text-[11px] leading-5 text-[#648084]">{recipe.description}</p><div className="mt-5 grid grid-cols-2 gap-2"><MiniMetric label="HPP / porsi" value={rupiah(result.cost)} /><MiniMetric label="Food cost" value={`${result.foodCost.toFixed(1)}%`} /><MiniMetric label="Harga jual" value={rupiah(recipe.price)} /><MiniMetric label="Margin" value={rupiah(result.margin)} /></div><div className="mt-6 rounded-2xl bg-[#123f47] p-5 text-white"><p className="text-[9px] font-black uppercase tracking-[0.15em] text-[#8bd6cc]">Takaran standar</p><p className="mt-2 text-3xl font-black">{recipe.portions} <span className="text-xs font-bold text-white/55">porsi / batch</span></p><p className="mt-2 text-[10px] leading-5 text-white/60">Gunakan komponen berikut saat produksi agar rasa dan biaya tetap konsisten.</p></div><div className="mt-5 space-y-2">{recipe.components.map((component) => { const ingredient = ingredients.find((entry) => entry.id === component.ingredientId); return <div key={component.ingredientId} className="flex items-center gap-3 rounded-xl border border-[#edf3f2] p-3"><span className="grid h-8 w-8 place-items-center rounded-lg bg-[#e6f6f3] text-[#0f766e]"><Package className="h-3.5 w-3.5" /></span><div className="min-w-0 flex-1"><p className="truncate text-[10px] font-black text-[#365b60]">{ingredient?.name}</p><p className="mt-1 text-[9px] text-[#94a8aa]">{formatQty(component.quantity)} {ingredient?.unit} · {rupiah((ingredient?.cost ?? 0) * component.quantity)}</p></div></div>; })}</div><div className="mt-6 flex gap-2"><button type="button" onClick={onEdit} className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-[#dcebea] px-3 py-3 text-[10px] font-black text-[#648084] hover:border-[#b9ded8] hover:text-[#0f766e]"><Pencil className="h-3.5 w-3.5" /> Edit resep</button><button type="button" onClick={onSimulate} className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#0f766e] px-3 py-3 text-[10px] font-black text-white hover:bg-[#0b625c]"><ClipboardCheck className="h-3.5 w-3.5" /> Simulasi produksi</button></div></aside></div>;
}

function RecipeModal({ recipe, ingredients, onClose, onSubmit }: { recipe: Recipe | null; ingredients: RecipeIngredient[]; onClose: () => void; onSubmit: (recipe: Recipe) => void }) {
  const [name, setName] = useState(recipe?.name ?? "");
  const [category, setCategory] = useState(recipe?.category ?? "Minuman kopi");
  const [description, setDescription] = useState(recipe?.description ?? "");
  const [price, setPrice] = useState(String(recipe?.price ?? 25000));
  const [portions, setPortions] = useState(String(recipe?.portions ?? 1));
  const [status, setStatus] = useState<RecipeStatus>(recipe?.status ?? "Draft");
  const [components, setComponents] = useState<RecipeComponent[]>(recipe?.components ?? [{ ingredientId: ingredients[0]?.id ?? "", quantity: 0.02 }]);
  function updateComponent(index: number, patch: Partial<RecipeComponent>) {
    setComponents((current) => current.map((component, componentIndex) => componentIndex === index ? { ...component, ...patch } : component));
  }
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleanName = name.trim();
    if (!cleanName || !components.length) return;
    onSubmit({ id: recipe?.id ?? `recipe-${Date.now()}`, name: cleanName, category, description: description.trim() || "Resep standar untuk operasional.", price: Number(price) || 0, portions: Math.max(1, Number(portions) || 1), components, status, version: recipe?.version ?? "v1", updatedAt: "Baru saja", owner: "Anda", tags: recipe?.tags ?? ["Draft"] });
  }
  return <ModalShell title={recipe ? "Edit resep" : "Tambah resep"} eyebrow="Recipe library" onClose={onClose}><form onSubmit={submit} className="space-y-4"><div className="grid gap-4 sm:grid-cols-2"><Field label="Nama resep"><input required autoFocus value={name} onChange={(event) => setName(event.target.value)} placeholder="Contoh: Matcha Latte" className={fieldClass} /></Field><Field label="Kategori"><select value={category} onChange={(event) => setCategory(event.target.value)} className={fieldClass}>{categoryOptions.slice(1).map((option) => <option key={option}>{option}</option>)}</select></Field></div><Field label="Deskripsi"><textarea value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Jelaskan hasil akhir dan penggunaan resep." rows={2} className={fieldClass} /></Field><div className="grid gap-4 sm:grid-cols-3"><Field label="Harga jual"><input required min="0" type="number" value={price} onChange={(event) => setPrice(event.target.value)} className={fieldClass} /></Field><Field label="Yield / batch"><input required min="1" type="number" value={portions} onChange={(event) => setPortions(event.target.value)} className={fieldClass} /></Field><Field label="Status"><select value={status} onChange={(event) => setStatus(event.target.value as RecipeStatus)} className={fieldClass}><option>Draft</option><option>Aktif</option><option>Arsip</option></select></Field></div><div className="rounded-2xl border border-[#e3eeed] p-4"><div className="flex items-center justify-between"><div><p className="text-[10px] font-black text-[#365b60]">Komponen bahan</p><p className="mt-1 text-[9px] text-[#94a8aa]">Takaran diisi untuk satu batch sesuai yield di atas.</p></div><button type="button" onClick={() => setComponents((current) => [...current, { ingredientId: ingredients[0]?.id ?? "", quantity: 0.01 }])} className="inline-flex items-center gap-1 rounded-lg bg-[#e6f6f3] px-2.5 py-2 text-[9px] font-black text-[#0f766e]"><Plus className="h-3 w-3" /> Tambah bahan</button></div><div className="mt-4 space-y-2">{components.map((component, index) => <div key={`${component.ingredientId}-${index}`} className="flex gap-2"><select value={component.ingredientId} onChange={(event) => updateComponent(index, { ingredientId: event.target.value })} className={`${fieldClass} min-w-0 flex-1`}>{ingredients.map((ingredient) => <option key={ingredient.id} value={ingredient.id}>{ingredient.name} · {ingredient.unit}</option>)}</select><input type="number" min="0.001" step="0.001" value={component.quantity} onChange={(event) => updateComponent(index, { quantity: Number(event.target.value) })} className={`${fieldClass} w-28`} /><button type="button" onClick={() => setComponents((current) => current.filter((_, componentIndex) => componentIndex !== index))} disabled={components.length === 1} className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-[#dcebea] text-[#9aadaf] hover:text-[#b75c54] disabled:opacity-40" aria-label="Hapus komponen"><Trash2 className="h-3.5 w-3.5" /></button></div>)}</div></div><ModalActions onClose={onClose} submitLabel={recipe ? "Simpan perubahan" : "Simpan resep"} /></form></ModalShell>;
}

function IngredientModal({ ingredient, onClose, onSubmit }: { ingredient: RecipeIngredient; onClose: () => void; onSubmit: (ingredient: RecipeIngredient) => void }) {
  const [cost, setCost] = useState(String(ingredient.cost));
  const [stock, setStock] = useState(String(ingredient.stock));
  return <ModalShell title={`Edit ${ingredient.name}`} eyebrow="Cost component" onClose={onClose}><form onSubmit={(event) => { event.preventDefault(); onSubmit({ ...ingredient, cost: Number(cost) || 0, stock: Number(stock) || 0 }); }} className="space-y-4"><div className="rounded-xl bg-[#f4fbfa] p-3"><p className="text-[10px] font-black text-[#365b60]">{ingredient.name}</p><p className="mt-1 text-[9px] text-[#94a8aa]">Sumber: {ingredient.supplier} · satuan {ingredient.unit}</p></div><div className="grid gap-4 sm:grid-cols-2"><Field label={`Harga per ${ingredient.unit}`}><input required min="0" type="number" value={cost} onChange={(event) => setCost(event.target.value)} className={fieldClass} /></Field><Field label={`Stok ${ingredient.unit}`}><input required min="0" step="0.001" type="number" value={stock} onChange={(event) => setStock(event.target.value)} className={fieldClass} /></Field></div><p className="text-[9px] leading-4 text-[#94a8aa]">Perubahan biaya akan langsung memengaruhi HPP dan laporan margin resep yang menggunakan bahan ini.</p><ModalActions onClose={onClose} submitLabel="Simpan biaya" /></form></ModalShell>;
}

function ModalShell({ title, eyebrow, onClose, children }: { title: string; eyebrow: string; onClose: () => void; children: ReactNode }) {
  return <div className="fixed inset-0 z-[80] flex items-end justify-center bg-[#183b43]/40 p-0 backdrop-blur-sm sm:items-center sm:p-5"><div role="dialog" aria-modal="true" className="max-h-[92dvh] w-full max-w-2xl overflow-y-auto rounded-t-[26px] bg-white p-5 shadow-2xl sm:rounded-[26px] sm:p-6"><div className="flex items-start justify-between"><div><p className="text-[9px] font-black uppercase tracking-[0.18em] text-[#0f766e]">{eyebrow}</p><h2 className="mt-2 text-xl font-black text-[#183b43]">{title}</h2></div><button type="button" onClick={onClose} aria-label="Tutup modal" className="grid h-8 w-8 place-items-center rounded-full bg-[#f4f9f8] text-[#6d878a] hover:bg-[#e6f6f3] hover:text-[#0f766e]"><X className="h-4 w-4" /></button></div><div className="mt-6">{children}</div></div></div>;
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
  return <div className="rounded-2xl border border-[#e3eeed] bg-white p-4"><div className="flex items-center justify-between"><span className={`grid h-9 w-9 place-items-center rounded-xl ${styles[tone]}`}><Icon className="h-4 w-4" /></span><CheckCircle2 className="h-3.5 w-3.5 text-[#9cb3b5]" /></div><p className="mt-4 text-[10px] font-bold text-[#94a8aa]">{label}</p><p className="mt-1 text-2xl font-black tracking-tight text-[#244950]">{value}</p><p className="mt-1 text-[9px] font-bold text-[#0f766e]">{detail}</p></div>;
}

function MiniMetric({ label, value }: { label: string; value: string }) {
  return <div className="rounded-lg bg-[#f4f9f8] p-2"><p className="text-[8px] font-semibold text-[#94a8aa]">{label}</p><p className="mt-1 truncate text-[11px] font-black text-[#365b60]">{value}</p></div>;
}

function QuickLink({ icon: Icon, title, detail, onClick }: { icon: typeof Package; title: string; detail: string; onClick: () => void }) {
  return <button type="button" onClick={onClick} className="rounded-2xl border border-[#e3eeed] bg-white p-4 text-left transition-colors hover:border-[#b9ded8] hover:bg-[#fbfefe]"><span className="grid h-9 w-9 place-items-center rounded-xl bg-[#e6f6f3] text-[#0f766e]"><Icon className="h-4 w-4" /></span><p className="mt-3 text-[11px] font-black text-[#365b60]">{title}</p><p className="mt-1 text-[9px] font-semibold text-[#94a8aa]">{detail}</p><ArrowRight className="mt-3 h-3.5 w-3.5 text-[#0f766e]" /></button>;
}

function StatusPill({ label }: { label: RecipeStatus }) {
  const classes = label === "Aktif" ? "bg-[#e6f6f3] text-[#0f766e]" : label === "Draft" ? "bg-[#fff1dd] text-[#a56c2b]" : "bg-[#f0f5f4] text-[#648084]";
  return <span className={`rounded-full px-2 py-1 text-[8px] font-black ${classes}`}>{label}</span>;
}

function EmptyState({ label }: { label: string }) {
  return <div className="rounded-2xl border border-dashed border-[#b9ded8] bg-[#f4fbfa] py-10 text-center text-xs font-semibold text-[#8aa1a3]">{label}</div>;
}

const filterClass = "rounded-xl border border-[#dcebea] px-3 py-2.5 text-[10px] font-black text-[#648084] outline-none focus:border-[#0f766e]";
const fieldClass = "w-full rounded-xl border border-[#dcebea] bg-[#fbfdfd] px-3 py-2.5 text-xs font-semibold text-[#365b60] outline-none placeholder:text-[#9bb1b3] focus:border-[#0f766e] focus:ring-2 focus:ring-[#b9ded8]";