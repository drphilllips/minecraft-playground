import Separator from "./Separator";


export default function FeatureContainer({
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