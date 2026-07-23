/* eslint-disable react/prop-types */
import TowerIcon from './TowerIcon';

/**
 * Helper function to format stat keys for display (e.g., baseCost -> Base Cost).
 * @param {string} key The raw key from the stats object.
 * @returns {string} The formatted key.
 */
const formatStatKey = (key) => {
  if (!key) return '';
  return key
    .replace(/([A-Z])/g, ' $1') // Add space before capital letters
    .replace(/^./, (str) => str.toUpperCase()); // Capitalize the first letter
};

/**
 * Helper function to format various stat values for display.
 * @param {*} value The value of the stat.
 * @returns {React.ReactNode} The formatted value, which can be a string or a JSX element.
 */
const formatStatValue = (value) => {
  if (value === null || value === undefined) {
    return <span className="text-gray-400">N/A</span>;
  }
  // Handle array of unlock options
  if (Array.isArray(value)) {
    if (value.length > 0 && value[0].type) {
      return (
        <div className="flex flex-col gap-1.5">
          {value.map((item, index) => (
            <div key={index} className="flex items-center gap-1.5">
              <TowerIcon iconName={item.type} />
              <span>
                {item.value.toLocaleString()}
                {item.requirement && <span className="text-xs text-gray-500 ml-1">({item.requirement})</span>}
              </span>
            </div>
          ))}
        </div>
      );
    }
    // Handle multiple damage sources (e.g., Engineer)
    if (value.length > 0 && value[0].source && value[0].value !== undefined) {
      return (
        <div className="flex flex-col gap-1.5">
          {value.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <span className="font-semibold">{item.value}</span>
              <span className="text-xs text-gray-500">({item.source})</span>
            </div>
          ))}
        </div>
      );
    }
    // Handle multiple damage methods (e.g., Engineer)
    if (value.length > 0 && value[0].method) {
      return value.map(item => item.method).join(' / ');
    }
    return value.join(', ');
  }
  if (typeof value === 'object') {
    if (value.icon && value.value !== undefined) {
      const displayValue = typeof value.value === 'object' ? `Regular: ${value.value.regular}, PvP: ${value.value.pvp}` : value.value.toLocaleString();
      return <div className="flex items-center gap-1.5"><TowerIcon iconName={value.icon} /><span>{displayValue}</span></div>;
    }
    return JSON.stringify(value);
  }
  return value.toString();
};

function TowerStatTable({ stats }) {
  if (!stats || Object.keys(stats).length === 0) {
    return null;
  }

  const statEntries = Object.entries(stats);

  return (
    <div className="mt-4 overflow-hidden border-t border-gray-200 pt-4">
      <table className="w-full text-left text-sm">
        <tbody>
          {statEntries.map(([key, value]) => {
            // Jika propertinya adalah goldenPerk, tampilkan sebagai tabel perbandingan
            if (key === 'goldenPerk') {
              const goldenStats = value;
              const perkKeys = Object.keys(goldenStats);

              return (
                <tr key="golden-perk-section" className="border-b border-gray-100 last:border-b-0">
                  <th scope="row" className="py-2 pr-2 font-semibold text-gray-600 align-top">Golden Perk</th>
                  <td className="py-2 text-gray-800">
                    <div className="overflow-hidden rounded-md border border-amber-300 bg-amber-50/50">
                      <table className="w-full text-xs">
                        <thead className="bg-amber-100/50">
                          <tr>
                            <th className="px-3 py-1.5 text-left font-bold text-amber-900">Stat</th>
                            <th className="px-3 py-1.5 text-left font-semibold text-gray-600">Normal</th>
                            <th className="px-3 py-1.5 text-left font-bold text-amber-800">Golden</th>
                          </tr>
                        </thead>
                        <tbody>
                          {perkKeys.map(perkKey => (
                            <tr key={perkKey} className="border-t border-amber-200/50">
                              <td className="px-3 py-1.5 font-medium text-gray-700">{formatStatKey(perkKey)}</td>
                              <td className="px-3 py-1.5">{formatStatValue(stats[perkKey])}</td>
                              <td className="px-3 py-1.5 font-semibold text-amber-800">{formatStatValue(goldenStats[perkKey])}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </td>
                </tr>
              );
            }
            // Tampilan default untuk properti lainnya
            return (
              <tr key={key} className="border-b border-gray-100 last:border-b-0">
                <th scope="row" className="py-2 pr-2 font-semibold text-gray-600 align-top">{formatStatKey(key)}</th>
                <td className="py-2 text-gray-800">{formatStatValue(value)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default TowerStatTable;