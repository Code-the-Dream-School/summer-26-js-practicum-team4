import React, { useMemo } from "react";
import PropTypes from "prop-types";

function PatternLegend({ palette, grid }) {
  const stitchCounts = useMemo(() => {
    const counts = new Array(palette.length).fill(0);

    grid.forEach((paletteIndex) => {
      if (counts[paletteIndex] !== undefined) {
        counts[paletteIndex] += 1;
      }
    });

    return counts;
  }, [grid, palette.length]);

  return (
    <section className="rounded-2xl border border-border bg-surface p-5 shadow-sm md:p-7">
      <h2 className="mb-4 text-2xl font-semibold text-secondary">
        DMC Color Key
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-left">
          <thead>
            <tr className="border-b-2 border-secondary text-secondary">
              <th className="px-3 py-3 font-semibold" scope="col">
                Symbol
              </th>
              <th className="px-3 py-3 font-semibold" scope="col">
                Color
              </th>
              <th className="px-3 py-3 font-semibold" scope="col">
                DMC
              </th>
              <th className="px-3 py-3 font-semibold" scope="col">
                Color Name
              </th>
              <th className="px-3 py-3 text-right font-semibold" scope="col">
                Stitches
              </th>
            </tr>
          </thead>

          <tbody>
            {palette.map((color, index) => (
              <tr
                key={color.dmcCode}
                className="border-b border-border last:border-b-0"
              >
                <td className="px-3 py-3 text-center text-lg font-bold text-secondary">
                  {color.symbol}
                </td>
                <td className="px-3 py-3">
                  <span
                    className="block h-8 w-8 rounded-md border border-black/20"
                    style={{
                      backgroundColor: `rgb(${color.r}, ${color.g}, ${color.b})`,
                    }}
                    title={`RGB ${color.r}, ${color.g}, ${color.b}`}
                    aria-label={`${color.name} color swatch`}
                  />
                </td>
                <td className="px-3 py-3 font-semibold text-primary">
                  {color.dmcCode}
                </td>
                <td className="px-3 py-3 text-text">{color.name}</td>
                <td className="px-3 py-3 text-right tabular-nums text-text">
                  {stitchCounts[index].toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

PatternLegend.propTypes = {
  palette: PropTypes.arrayOf(
    PropTypes.shape({
      dmcCode: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      r: PropTypes.number.isRequired,
      g: PropTypes.number.isRequired,
      b: PropTypes.number.isRequired,
      symbol: PropTypes.string.isRequired,
    }),
  ).isRequired,
  grid: PropTypes.arrayOf(PropTypes.number).isRequired,
};

export default PatternLegend;
