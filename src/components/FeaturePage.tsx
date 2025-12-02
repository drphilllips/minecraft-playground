import { useResponsiveDesign } from "../hooks/useResponsiveDesign";


export default function FeaturePage({
  name,
  description,
  children,
}: {
  name: string;
  description: string;
  children?: React.ReactNode;
}) {
  const { onMobile } = useResponsiveDesign();

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <div className={`flex flex-col gap-5 w-full ${onMobile ? "px-4 py-6" : "px-6 py-12"} max-w-4xl mx-auto`}>
        <div className="flex flex-col gap-3">
          <h2 className="text-3xl font-bold">{name}</h2>
          <p className="text-slate-300 max-w-2xl">{description}</p>
        </div>

        {children}
      </div>
    </div>
  );
}