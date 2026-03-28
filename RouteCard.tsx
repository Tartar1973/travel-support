"use client";

type Props = {
  stations: string[];
  from: string;
  to: string;
  onChangeFrom: (value: string) => void;
  onChangeTo: (value: string) => void;
  onSubmit: () => void;
};

export default function SearchForm({
  stations,
  from,
  to,
  onChangeFrom,
  onChangeTo,
  onSubmit,
}: Props) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-gray-900">
        Find the right train
      </h2>
      <p className="mt-2 text-sm text-gray-600">
        Choose your departure and destination stations.
      </p>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Departure station
          </label>
          <select
            value={from}
            onChange={(e) => onChangeFrom(e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm"
          >
            <option value="">Select departure</option>
            {stations.map((station) => (
              <option key={station} value={station}>
                {station}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Destination station
          </label>
          <select
            value={to}
            onChange={(e) => onChangeTo(e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm"
          >
            <option value="">Select destination</option>
            {stations.map((station) => (
              <option key={station} value={station}>
                {station}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        onClick={onSubmit}
        className="mt-5 w-full rounded-xl bg-black px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90"
      >
        Search guidance
      </button>
    </div>
  );
}
