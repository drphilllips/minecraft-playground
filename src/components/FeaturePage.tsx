import { Link } from "react-router-dom";
import { useResponsiveDesign } from "../contexts/useResponsiveDesign";
import Separator from "./Separator";


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
    <>
      {onMobile && <FeaturePageHeader name={name} />}
      <div className="min-h-screen bg-slate-900 text-slate-100">
        <div className={`flex flex-col w-full ${onMobile ? "p-4 gap-4" : "px-6 py-12 gap-5"} max-w-4xl mx-auto`}>
          <div className="flex flex-col gap-3">
            {!onMobile && <h2 className="text-3xl font-bold">{name}</h2>}
            <p className="text-slate-300 max-w-2xl">{description}</p>
          </div>

          {children}
        </div>
      </div>
    </>
  );
}

export function FeaturePageHeader({
  name,
}: {
  name: string;
}) {
  return (
    <div className="sticky top-0 z-50">
      <nav className="relative flex flex-row items-center justify-center bg-slate-800 py-6 text-center">
        <Link
          to="/"
          className="absolute left-4 flex flex-row items-center gap-1 text-slate-200 hover:text-white text-lg font-medium"
        >
          <span className="text-xl">‹</span>
          Back
        </Link>
        <p className="text-2xl font-bold text-slate-100">{name}</p>
      </nav>
    </div>
  )
}

export function FeatureContainer({
  inputFields,
  outputDisplay,
}: {
  inputFields: React.ReactNode[];
  outputDisplay: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 bg-slate-800/40 rounded-2xl p-6 border border-slate-700">
      {inputFields}

      <div className="flex flex-col gap-3 w-fit">
        <Separator className="w-full" />

        {outputDisplay}
      </div>
    </div>
  )
}

export function FeatureOutputContainer({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <div className="flex">
      <div className="flex rounded-2xl border border-slate-700 bg-slate-950/80 p-3">
        {children}
      </div>
    </div>
  )
}