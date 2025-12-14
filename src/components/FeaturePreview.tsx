import { Link, type To } from "react-router-dom";
import { useResponsiveDesign } from "../contexts/useResponsiveDesign";


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
  const { onMobile, isStandalone } = useResponsiveDesign();

  return (
    <div className="inline-flex shrink-0">
      <Link
        to={linkToPage}
        className="inline-block"
      >
        <div className={`flex ${onMobile ? (isStandalone ? "flex-row p-4" : "flex-row px-4 py-2") : "flex-col p-6"} gap-3 w-fit max-w-full bg-slate-800/40 rounded-2xl border border-slate-700 transition-transform hover:opacity-80 hover:-translate-y-1 active:opacity-70 active:translate-y-0.5 cursor-pointer`}>
          <div className={`${onMobile && "flex flex-col"} flex flex-col min-w-0 max-w-[42ch]`}>
            <div className="flex items-baseline justify-between gap-2">
              <h2 className={`${onMobile ? "text-xl" : "text-2xl"} font-semibold text-left`}>{name}</h2>
            </div>
            <p className={`
              text-sm text-slate-300 text-left
              mt-1 whitespace-normal
              text-wrap overflow-hidden
              ${onMobile ? "max-w-[200px]" : "max-w-3xs"}
            `}>
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