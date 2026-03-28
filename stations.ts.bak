import type { RouteGuide } from "@/data/routes";

type Props = {
  guide: RouteGuide;
};

export default function RouteCard({ guide }: Props) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900">
        Recommended guidance
      </h3>

      <div className="mt-4 space-y-3 text-sm text-gray-700">
        <p>
          <span className="font-semibold">Line:</span> {guide.line}
        </p>
        <p>
          <span className="font-semibold">Platform:</span> {guide.platform}
        </p>
        <p>
          <span className="font-semibold">Direction:</span> {guide.direction}
        </p>
        <p>
          <span className="font-semibold">Train type:</span> {guide.trainType}
        </p>
        <div>
          <p className="font-semibold">Board if the display says:</p>
          <ul className="mt-2 list-disc pl-5">
            {guide.destinationSigns.map((sign) => (
              <li key={sign}>{sign}</li>
            ))}
          </ul>
        </div>
        {guide.caution && (
          <p className="rounded-xl bg-amber-50 px-4 py-3 text-amber-800">
            {guide.caution}
          </p>
        )}
      </div>
    </div>
  );
}
