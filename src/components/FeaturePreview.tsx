import { Link, type To } from "react-router-dom";
import { useResponsiveDesign } from "../hooks/useResponsiveDesign";


export default function FeaturePreview({
  name,
  linkToPage,
  description,
  children,
}: {
  name: string;
  linkToPage: To;
  description: string;
  children?: React.ReactNode;
}) {
  const { onMobile } = useResponsiveDesign();

  return (
    <div className="flex-1">
      <Link
        to={linkToPage}
        className="block h-full"
      >
        <div className={`flex ${onMobile ? "flex-row" : "flex-col"} gap-3 h-full bg-slate-800/40 rounded-2xl p-6 border border-slate-700 transition-transform hover:opacity-80 hover:-translate-y-1 active:opacity-70 active:translate-y-0.5 cursor-pointer`}>
          <div className={`${onMobile && "flex flex-col"}`}>
            <div className="flex items-baseline justify-between gap-2">
              <h2 className="text-2xl font-semibold text-left">{name}</h2>
            </div>
            <p className="text-sm text-slate-300 text-left">
              {description}
            </p>
          </div>
          {/* Feature preview placeholder */}
          <div className={`mt-auto ${onMobile && "ml-auto"}`}>
            {children}
          </div>
        </div>
      </Link>
    </div>
  )
}