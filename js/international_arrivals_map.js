const statusEl = document.querySelector("#chart-status");

const colors = {
  blue: "#2E6DA4",
  teal: "#2E9B9B",
  green: "#2E8B57",
  orange: "#F4A261",
  red: "#D84C4C",
  purple: "#6b5fb5",
  text: "#152238",
  muted: "#5b6d86"
};

function showStatus(message) {
  statusEl.textContent = message;
  statusEl.classList.add("is-visible");
}

function hideStatus() {
  statusEl.textContent = "";
  statusEl.classList.remove("is-visible");
}

function chartWidth(selector, fallback = 520, min = 320) {
  const el = document.querySelector(selector);
  return Math.max(min, Math.floor((el?.clientWidth || fallback) - 4));
}

function baseConfig() {
  return {
    background: "#ffffff",
    font: "Inter",
    title: {
      font: "Oswald",
      color: colors.text,
      subtitleFont: "Inter",
      subtitleColor: colors.muted,
      anchor: "start"
    },
    axis: {
      labelFont: "Inter",
      titleFont: "Inter",
      labelColor: "#34445c",
      titleColor: "#34445c",
      gridColor: "#e7eef5",
      domainColor: "#c8d8e7",
      tickColor: "#c8d8e7"
    },
    legend: {
      labelFont: "Inter",
      titleFont: "Inter",
      labelColor: "#34445c",
      titleColor: "#34445c"
    },
    view: {
      stroke: null
    }
  };
}

function mapSpec() {
  const width = chartWidth("#arrivals-map", 720);
  const halfWidth = Math.floor((width - 4) / 2);
  const mapHeight = 370;

  const makeMapLayer = (region, showLegend) => ({
    width: halfWidth,
    height: mapHeight,
    projection: {
      type: "mercator",
      center: region === "Peninsular" ? [101.65, 4.05] : [115.1, 4.0],
      scale: region === "Peninsular" ? 4300 : 2450,
      translate: [
        region === "Peninsular" ? halfWidth / 2 - 36 : halfWidth / 2 + 36,
        mapHeight / 2
      ]
    },
    layer: [
      {
        data: {
          url: "data/malaysia.state.geojson",
          format: { type: "json", property: "features" }
        },
        transform: [
          {
            lookup: "properties.name",
            from: {
              data: { url: "data/foreign_hotel_guests_by_state_2024.csv" },
              key: "State",
              fields: ["Display_State", "Foreigner_2024", "Foreigner_2024_Million", "Region"]
            }
          },
          { filter: `datum.Region == '${region}'` },
          { calculate: "toNumber(datum.Foreigner_2024)", as: "Foreigner_2024_Number" },
          { calculate: "toNumber(datum.Foreigner_2024_Million)", as: "Foreigner_2024_Million_Number" }
        ],
        mark: { type: "geoshape", stroke: "#ffffff", strokeWidth: 1 },
        encoding: {
          color: {
            field: "Foreigner_2024_Million_Number",
            type: "quantitative",
            title: "Foreign Hotel Guests, 2024",
            scale: { scheme: "blues", domain: [0, 12.2] },
            legend: showLegend
              ? {
                  orient: "bottom",
                  direction: "horizontal",
                  gradientLength: Math.min(360, width - 80),
                  gradientThickness: 14,
                  format: ".1f"
                }
              : null
          },
          tooltip: [
            { field: "Display_State", type: "nominal", title: "State" },
            { field: "Foreigner_2024_Number", type: "quantitative", title: "Foreigner_2024", format: "," }
          ]
        }
      },
      labelLayer(region, true),
      labelLayer(region, false)
    ]
  });

  return {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    hconcat: [makeMapLayer("Peninsular", true), makeMapLayer("Borneo", false)],
    spacing: 4,
    resolve: { scale: { color: "shared" } },
    config: baseConfig()
  };
}

function labelLayer(region, halo) {
  return {
    data: { url: "data/foreign_hotel_guests_by_state_2024.csv" },
    transform: [
      { filter: `datum.Region == '${region}' && datum.Show_Label == 'true'` },
      {
        calculate: "datum.Display_State + '\\n' + format(toNumber(datum.Foreigner_2024_Million), '.1f') + 'M'",
        as: "Label"
      }
    ],
    mark: {
      type: "text",
      align: "center",
      baseline: "middle",
      font: "Arial",
      fontSize: 10.5,
      fontWeight: "bold",
      lineBreak: "\n",
      lineHeight: 14,
      color: colors.text,
      stroke: halo ? "#ffffff" : null,
      strokeWidth: halo ? 3 : 0
    },
    encoding: {
      longitude: { field: "Label_Lon", type: "quantitative" },
      latitude: { field: "Label_Lat", type: "quantitative" },
      text: { field: "Label", type: "nominal" }
    }
  };
}

function sourceMarketsSpec() {
  const width = chartWidth("#source-markets-chart", 390);
  const tableWidth = Math.min(230, Math.max(170, Math.floor(width * 0.34)));
  const growthWidth = Math.min(110, Math.max(86, Math.floor(width * 0.18)));
  const barWidth = Math.max(170, width - tableWidth - growthWidth - 22);
  const countrySort = [
    "Singapore",
    "Indonesia",
    "China",
    "Thailand",
    "Brunei",
    "India",
    "Philippines",
    "South Korea",
    "Australia",
    "Chinese Taipei"
  ];
  const rowScale = { paddingInner: 0.36, paddingOuter: 0.14 };
  const chartHeight = 360;
  const growthDomain = ["Decline", "Steady Growth", "Fast Growth", "Surging Growth"];
  const growthRange = ["#D84C4C", "#2F7EBB", "#2E9B9B", "#3B9B5C"];

  return {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    data: { url: "data/top_source_markets_2024.csv" },
    transform: [
      { filter: "datum.Rank <= 10" },
      { calculate: "datum.Arrivals_2024 / 1000000", as: "Arrivals_Million" },
      {
        calculate: "datum.Growth_Pct < 0 ? 'Decline' : datum.Growth_Pct > 80 ? 'Surging Growth' : datum.Growth_Pct > 30 ? 'Fast Growth' : 'Steady Growth'",
        as: "Growth_Group"
      },
      { calculate: "datum.Growth_Pct > 0 ? '+' + format(datum.Growth_Pct, '.1f') + '%' : format(datum.Growth_Pct, '.1f') + '%'", as: "Growth_Label" }
    ],
    vconcat: [
      {
        hconcat: [
          {
            width: tableWidth,
            height: chartHeight,
            title: { text: "Country", fontSize: 12, anchor: "start", offset: 8 },
            layer: [
              {
                mark: { type: "image", width: 30, height: 20, align: "center", baseline: "middle" },
                encoding: {
                  x: { value: 14 },
                  y: { field: "Country", type: "nominal", sort: countrySort, axis: null, scale: rowScale },
                  url: { field: "Flag_Path", type: "nominal" }
                }
              },
              {
                mark: { type: "text", align: "left", baseline: "middle", fontSize: 14, fontWeight: "bold", color: "#1D4E89" },
                encoding: {
                  x: { value: 48 },
                  y: { field: "Country", type: "nominal", sort: countrySort, axis: null, scale: rowScale },
                  text: { field: "Flag", type: "nominal" }
                }
              },
              {
                mark: { type: "text", align: "left", baseline: "middle", fontSize: 16, fontWeight: 500, color: "#1F2937" },
                encoding: {
                  x: { value: 78 },
                  y: { field: "Country", type: "nominal", sort: countrySort, axis: null, scale: rowScale },
                  text: { field: "Country", type: "nominal" },
                  tooltip: [
                    { field: "Country", title: "Country" },
                    { field: "Arrivals_2024", title: "Arrivals_2024", format: "," },
                    { field: "Growth_Pct", title: "Growth %", format: ".1f" }
                  ]
                }
              }
            ]
          },
          {
            width: barWidth,
            height: chartHeight,
            title: { text: "Arrivals (million)", fontSize: 12, anchor: "start", offset: 8 },
            layer: [
              {
                mark: { type: "bar", size: 24, cornerRadiusEnd: 4 },
                encoding: {
                  y: { field: "Country", type: "nominal", sort: countrySort, axis: null, scale: rowScale },
                  x: {
                    field: "Arrivals_Million",
                    type: "quantitative",
                    title: "Arrivals (million, sqrt scale)",
                    scale: { type: "sqrt", domain: [0, 20] },
                    axis: { grid: true, values: [0, 0.5, 1, 2, 5, 10, 15, 20] }
                  },
                  color: {
                    field: "Growth_Group",
                    type: "nominal",
                    title: null,
                    scale: { domain: growthDomain, range: growthRange },
                    legend: null
                  },
                  tooltip: [
                    { field: "Country", title: "Country" },
                    { field: "Arrivals_2024", title: "Arrivals_2024", format: "," },
                    { field: "Growth_Pct", title: "Growth %", format: ".1f" }
                  ]
                }
              },
              {
                mark: { type: "text", align: "left", dx: 8, baseline: "middle", fontWeight: 700, fontSize: 14, color: "#1F2937" },
                encoding: {
                  y: { field: "Country", type: "nominal", sort: countrySort, axis: null, scale: rowScale },
                  x: { field: "Arrivals_Million", type: "quantitative", scale: { type: "sqrt", domain: [0, 20] } },
                  text: { field: "Arrivals_Million", type: "quantitative", format: ".1f" }
                }
              }
            ]
          },
          {
            width: growthWidth,
            height: chartHeight,
            title: { text: "Growth vs 2023", fontSize: 12, anchor: "start", offset: 8 },
            mark: { type: "text", align: "left", baseline: "middle", fontSize: 14, fontWeight: 700 },
            encoding: {
              x: { value: 4 },
              y: { field: "Country", type: "nominal", sort: countrySort, axis: null, scale: rowScale },
              text: { field: "Growth_Label", type: "nominal" },
              color: {
                condition: { test: "datum.Growth_Pct < 0", value: "#D84C4C" },
                value: "#2E8B57"
              },
              tooltip: [
                { field: "Country", title: "Country" },
                { field: "Growth_Pct", title: "Growth %", format: ".1f" }
              ]
            }
          }
        ],
        spacing: 10
      },
      {
        width,
        height: 38,
        data: {
          values: [
            { label: "Decline", color: "#D84C4C", x: 0 },
            { label: "Steady Growth", color: "#2F7EBB", x: 86 },
            { label: "Fast Growth", color: "#2E9B9B", x: 214 },
            { label: "Surging Growth", color: "#3B9B5C", x: 328 }
          ]
        },
        title: { text: "Growth group", anchor: "start", fontSize: 12, offset: 6 },
        layer: [
          {
            mark: { type: "rect", width: 16, height: 12, cornerRadius: 3 },
            encoding: {
              x: { field: "x", type: "quantitative", axis: null },
              y: { value: 18 },
              color: { field: "color", type: "nominal", scale: null, legend: null }
            }
          },
          {
            mark: { type: "text", align: "left", baseline: "middle", dx: 16, fontSize: 12, color: "#34445c" },
            encoding: {
              x: { field: "x", type: "quantitative", axis: null },
              y: { value: 18 },
              text: { field: "label", type: "nominal" }
            }
          }
        ]
      }
    ],
    spacing: 10,
    resolve: { scale: { color: "independent" } },
    config: baseConfig()
  };
}

function monthlyTrendSpec() {
  return {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    width: chartWidth("#monthly-trend-chart"),
    title: {
      text: "Monthly Foreign Visitors",
      subtitle: "Lines compare monthly arrivals; bars below show 2024 growth vs 2023",
      fontSize: 24,
      subtitleFontSize: 14
    },
    data: { url: "data/foreign_visitors_monthly_2024_2023.csv" },
    vconcat: [
      {
        width: chartWidth("#monthly-trend-chart"),
        height: 250,
        transform: [
          { fold: ["Visitors_2024", "Visitors_2023"], as: ["Year", "Visitors"] },
          { calculate: "replace(datum.Year, 'Visitors_', '')", as: "Year_Label" },
          { calculate: "datum.Visitors / 1000000", as: "Visitors_Million" }
        ],
        mark: { type: "line", point: { filled: true, size: 55 }, strokeWidth: 3, interpolate: "monotone" },
        encoding: {
          x: {
            field: "Month_Num",
            type: "ordinal",
            title: null,
            axis: {
              labelAngle: 0,
              labelExpr: "['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][datum.value - 1]"
            }
          },
          y: {
            field: "Visitors_Million",
            type: "quantitative",
            title: "Visitors (million)",
            scale: { zero: false }
          },
          color: {
            field: "Year_Label",
            type: "nominal",
            title: "Year",
            scale: {
              domain: ["2023", "2024"],
              range: [colors.blue, colors.orange]
            }
          },
          tooltip: [
            { field: "Month", title: "Month" },
            { field: "Year_Label", title: "Year" },
            { field: "Visitors", title: "Visitors", format: "," }
          ]
        }
      },
      {
        width: chartWidth("#monthly-trend-chart"),
        height: 90,
        mark: { type: "bar", cornerRadiusEnd: 3, color: colors.green },
        encoding: {
          x: {
            field: "Month_Num",
            type: "ordinal",
            title: "Month",
            axis: {
              labelAngle: 0,
              labelExpr: "['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][datum.value - 1]"
            }
          },
          y: { field: "Growth_Pct", type: "quantitative", title: "Growth %" },
          tooltip: [
            { field: "Month", title: "Month" },
            { field: "Growth_Pct", title: "Growth %", format: ".1f" }
          ]
        }
      }
    ],
    spacing: 8,
    config: baseConfig()
  };
}

function transportSpec() {
  return {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    width: Math.min(320, chartWidth("#transport-chart", 320, 220)),
    height: 320,
    title: {
      text: "Mode of Transport",
      subtitle: "Land dominates foreign visitor arrivals in 2024",
      fontSize: 24,
      subtitleFontSize: 14
    },
    data: { url: "data/mode_of_transport_2024_2023.csv" },
    layer: [
      {
        mark: { type: "arc", innerRadius: 72, outerRadius: 122, stroke: "#ffffff", strokeWidth: 3 },
        encoding: {
          theta: { field: "Share_2024", type: "quantitative" },
          order: { field: "Share_2024", sort: "descending" },
          color: {
            field: "Mode",
            type: "nominal",
            scale: {
              domain: ["Land", "Air", "Sea", "Rail"],
              range: ["#2F9559", "#267DB7", "#6B5BB8", "#E57B1F"]
            },
            legend: null
          },
          tooltip: [
            { field: "Mode", title: "Mode" },
            { field: "Visitors_2024", title: "Visitors_2024", format: "," },
            { field: "Share_2024", title: "Share 2024", format: ".1f" }
          ]
        }
      },
      {
        data: { values: [{ label: "Dominant Mode", mode: "Land", share: "66.1%" }] },
        mark: { type: "text", align: "center", baseline: "middle", dy: -28, fontSize: 12, fontWeight: "bold", color: "#5d6878" },
        encoding: { text: { field: "label" } }
      },
      {
        data: { values: [{ mode: "Land" }] },
        mark: { type: "text", align: "center", baseline: "middle", dy: 0, fontSize: 26, fontWeight: "bold", color: "#2F9559" },
        encoding: { text: { field: "mode" } }
      },
      {
        data: { values: [{ share: "66.1%" }] },
        mark: { type: "text", align: "center", baseline: "middle", dy: 34, fontSize: 32, fontWeight: "bold", color: "#2F9559" },
        encoding: { text: { field: "share" } }
      }
    ],
    config: baseConfig()
  };
}

function expenditureSpec() {
  return {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    width: chartWidth("#expenditure-chart"),
    height: 360,
    title: {
      text: "Visitor Expenditure Mix",
      subtitle: "2024 value by category; colour shows year-on-year growth",
      fontSize: 24,
      subtitleFontSize: 14
    },
    data: { url: "data/visitor_expenditure_items_2024_2023.csv" },
    transform: [
      { calculate: "datum.Value_2024_RM_Mil / 1000", as: "Value_2024_RM_Bil" },
      { filter: "datum.Share_2024 >= 1" }
    ],
    layer: [
      {
        mark: { type: "bar", cornerRadiusEnd: 3 },
        encoding: {
          y: { field: "Item", type: "nominal", sort: "-x", title: null },
          x: { field: "Value_2024_RM_Bil", type: "quantitative", title: "RM billion" },
          color: {
            field: "Growth_Pct",
            type: "quantitative",
            title: "Growth %",
            scale: { domain: [-20, 140], range: [colors.red, "#d8c56a", colors.green] }
          },
          tooltip: [
            { field: "Item", title: "Item" },
            { field: "Value_2024_RM_Mil", title: "2024 RM mil.", format: ",.2f" },
            { field: "Share_2024", title: "Share 2024", format: ".1f" },
            { field: "Growth_Pct", title: "Growth %", format: ".1f" }
          ]
        }
      },
      {
        mark: { type: "text", align: "left", dx: 5, baseline: "middle", fontWeight: "bold" },
        encoding: {
          y: { field: "Item", type: "nominal", sort: "-x" },
          x: { field: "Value_2024_RM_Bil", type: "quantitative" },
          text: { field: "Share_2024", type: "quantitative", format: ".1f" },
          color: { value: colors.text }
        }
      }
    ],
    config: baseConfig()
  };
}

function receiptsScatterSpec() {
  return {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    width: chartWidth("#receipts-scatter-chart"),
    height: 360,
    title: {
      text: "Arrivals vs Receipts by Market",
      subtitle: "Bubble size indicates estimated RM per visitor",
      fontSize: 24,
      subtitleFontSize: 14
    },
    data: { url: "data/top_source_markets_2024.csv" },
    transform: [
      {
        lookup: "Country",
        from: {
          data: { url: "data/visitor_receipts_by_country_2024_2023.csv" },
          key: "Country",
          fields: ["Receipts_2024_RM_Mil"]
        }
      },
      { filter: "isValid(datum.Receipts_2024_RM_Mil)" },
      { calculate: "datum.Arrivals_2024 / 1000000", as: "Arrivals_Million" },
      { calculate: "datum.Receipts_2024_RM_Mil / 1000", as: "Receipts_RM_Bil" },
      { calculate: "datum.Receipts_2024_RM_Mil * 1000000 / datum.Arrivals_2024", as: "RM_Per_Visitor" },
      { filter: "datum.Rank <= 14" }
    ],
    layer: [
      {
        data: {
          values: [
            { x: 9, y: 24, label: "High Arrivals + High Spending" },
            { x: 1.7, y: 24, label: "Low Arrivals + High Spending" },
            { x: 9, y: 5, label: "High Arrivals + Low Spending" },
            { x: 1.7, y: 5, label: "Emerging Markets" }
          ]
        },
        mark: { type: "text", align: "center", baseline: "middle", fontSize: 12, fontWeight: "bold", color: "#8b9bb0", opacity: 0.75 },
        encoding: {
          x: { field: "x", type: "quantitative" },
          y: { field: "y", type: "quantitative" },
          text: { field: "label" }
        }
      },
      {
        mark: { type: "rule", strokeDash: [5, 5], color: "#cbd8e6" },
        encoding: { x: { datum: 3, type: "quantitative" } }
      },
      {
        mark: { type: "rule", strokeDash: [5, 5], color: "#cbd8e6" },
        encoding: { y: { datum: 8, type: "quantitative" } }
      },
      {
        mark: { type: "circle", opacity: 0.82, stroke: "#ffffff", strokeWidth: 1.4 },
        encoding: {
          x: { field: "Arrivals_Million", type: "quantitative", title: "Arrivals (million)", scale: { domain: [0, 20] } },
          y: { field: "Receipts_RM_Bil", type: "quantitative", title: "Receipts (RM billion)", scale: { domain: [0, 30] } },
          size: {
            field: "RM_Per_Visitor",
            type: "quantitative",
            title: "RM per visitor",
            scale: { range: [180, 2600] }
          },
          color: {
            field: "Growth_Pct",
            type: "quantitative",
            title: "Arrival growth %",
            scale: { domain: [-5, 135], range: [colors.red, "#d8c56a", colors.green] }
          },
          tooltip: [
            { field: "Country", title: "Country" },
            { field: "Arrivals_2024", title: "Arrivals_2024", format: "," },
            { field: "Receipts_2024_RM_Mil", title: "Receipts RM mil.", format: ",.2f" },
            { field: "RM_Per_Visitor", title: "RM per visitor", format: ",.0f" }
          ]
        }
      },
      {
        transform: [{ filter: "datum.Country == 'Singapore' || datum.Country == 'China' || datum.Country == 'Indonesia' || datum.Country == 'India' || datum.Country == 'Australia' || datum.Country == 'United Kingdom'" }],
        mark: { type: "text", dy: -14, fontSize: 12, fontWeight: "bold", color: colors.text },
        encoding: {
          x: { field: "Arrivals_Million", type: "quantitative" },
          y: { field: "Receipts_RM_Bil", type: "quantitative" },
          text: { field: "Country" }
        }
      }
    ],
    config: baseConfig()
  };
}

function stateGuestsSpec() {
  const width = chartWidth("#state-guests-chart", 720);
  const halfWidth = Math.floor((width - 4) / 2);
  const mapHeight = 350;
  const peninsularCodes = ["KDH", "KTN", "PRK", "PNG", "KUL", "NSN", "MLK", "PLS", "PHG", "TRG", "PJY", "SGR", "JHR"];

  const growthMapLayer = (region, showLegend) => ({
    width: halfWidth,
    height: mapHeight,
    projection: {
      type: "mercator",
      center: region === "Peninsular" ? [101.65, 4.05] : [115.1, 4.0],
      scale: region === "Peninsular" ? 4300 : 2450,
      translate: [region === "Peninsular" ? halfWidth / 2 - 36 : halfWidth / 2 + 36, mapHeight / 2]
    },
    data: { url: "data/malaysia.state.geojson", format: { type: "json", property: "features" } },
    transform: [
      {
        lookup: "properties.state",
        from: {
          data: { url: "data/international_arrivals_by_state_2024.csv" },
          key: "state_code",
          fields: ["state", "international_2024", "international_growth_pct"]
        }
      },
      {
        filter: region === "Peninsular"
          ? `indexof(${JSON.stringify(peninsularCodes)}, datum.properties.state) >= 0`
          : `indexof(${JSON.stringify(peninsularCodes)}, datum.properties.state) < 0`
      },
      { calculate: "toNumber(datum.international_growth_pct)", as: "Growth" },
      { calculate: "toNumber(datum.international_2024)", as: "Foreign_2024" }
    ],
    mark: { type: "geoshape", stroke: "#ffffff", strokeWidth: 1.1 },
    encoding: {
      color: {
        field: "Growth",
        type: "quantitative",
        title: "Growth 2024/2023 (%)",
        scale: { domain: [-35, 0, 75], range: ["#D84C4C", "#F5D98B", "#2E8B57"] },
        legend: showLegend ? { orient: "bottom", direction: "horizontal", gradientLength: Math.min(380, width - 80), format: ".0f" } : null
      },
      tooltip: [
        { field: "state", title: "State" },
        { field: "Foreign_2024", title: "Foreign hotel guests 2024", format: "," },
        { field: "Growth", title: "Growth %", format: ".1f" }
      ]
    }
  });

  return {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    title: {
      text: "Tourism Growth by State",
      subtitle: "Growth in foreign hotel guests from 2023 to 2024",
      fontSize: 24,
      subtitleFontSize: 14
    },
    hconcat: [growthMapLayer("Peninsular", true), growthMapLayer("Borneo", false)],
    spacing: 4,
    resolve: { scale: { color: "shared" } },
    config: baseConfig()
  };
}

function capacityAorSpec() {
  return {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    width: chartWidth("#capacity-aor-chart"),
    height: 370,
    title: {
      text: "Arrivals vs Growth by State",
      subtitle: "Verified state-level foreign hotel guests; the reports do not publish state-level spending",
      fontSize: 24,
      subtitleFontSize: 14
    },
    data: { url: "data/international_arrivals_by_state_2024.csv" },
    transform: [
      { calculate: "datum.international_2024 / 1000000", as: "Foreign_Million" },
      { calculate: "datum.total_2024 / 1000000", as: "Total_Million" }
    ],
    layer: [
      {
        data: {
          values: [
            { x: 8.2, y: 55, label: "High arrivals + high growth" },
            { x: 8.2, y: -22, label: "High arrivals + low growth" },
            { x: 1.3, y: 55, label: "Emerging growth markets" },
            { x: 1.3, y: -22, label: "Low arrivals + low growth" }
          ]
        },
        mark: { type: "text", align: "center", baseline: "middle", fontSize: 12, fontWeight: "bold", color: "#8b9bb0", opacity: 0.75 },
        encoding: {
          x: { field: "x", type: "quantitative" },
          y: { field: "y", type: "quantitative" },
          text: { field: "label" }
        }
      },
      { mark: { type: "rule", color: "#cbd8e6", strokeDash: [5, 5] }, encoding: { x: { datum: 3, type: "quantitative" } } },
      { mark: { type: "rule", color: "#cbd8e6", strokeDash: [5, 5] }, encoding: { y: { datum: 20, type: "quantitative" } } },
      {
        mark: { type: "circle", opacity: 0.82, stroke: "#ffffff", strokeWidth: 1.4 },
        encoding: {
          x: { field: "Foreign_Million", type: "quantitative", title: "Foreign hotel guests (million)", scale: { domain: [0, 12.8] } },
          y: { field: "international_growth_pct", type: "quantitative", title: "Growth 2024/2023 (%)", scale: { domain: [-35, 80] } },
          size: { field: "Total_Million", type: "quantitative", title: "Total hotel guests (million)", scale: { range: [120, 2200] } },
          color: {
            field: "international_growth_pct",
            type: "quantitative",
            title: "Growth %",
            scale: { domain: [-35, 0, 75], range: ["#D84C4C", "#F5D98B", "#2E8B57"] }
          },
          tooltip: [
            { field: "state", title: "State" },
            { field: "international_2024", title: "Foreign guests", format: "," },
            { field: "international_growth_pct", title: "Growth %", format: ".1f" },
            { field: "total_2024", title: "Total guests", format: "," }
          ]
        }
      },
      {
        transform: [{ filter: "datum.international_2024 >= 2500000 || datum.international_growth_pct >= 40 || datum.international_growth_pct < -10" }],
        mark: { type: "text", dy: -14, fontSize: 12, fontWeight: "bold", color: colors.text },
        encoding: {
          x: { field: "Foreign_Million", type: "quantitative" },
          y: { field: "international_growth_pct", type: "quantitative" },
          text: { field: "state" }
        }
      }
    ],
    config: baseConfig()
  };
}

const charts = [
  ["#arrivals-map", mapSpec],
  ["#source-markets-chart", sourceMarketsSpec],
  ["#monthly-trend-chart", monthlyTrendSpec],
  ["#transport-chart", transportSpec],
  ["#expenditure-chart", expenditureSpec],
  ["#receipts-scatter-chart", receiptsScatterSpec],
  ["#state-guests-chart", stateGuestsSpec],
  ["#capacity-aor-chart", capacityAorSpec]
];

async function renderAll() {
  try {
    if (!window.vega || !window.vegaLite || !window.vegaEmbed) {
      showStatus("Vega libraries did not load. Please check the internet connection and refresh the page.");
      return;
    }

    hideStatus();
    await Promise.all(
      charts.map(([selector, makeSpec]) =>
        vegaEmbed(selector, makeSpec(), { actions: false, renderer: "svg" })
      )
    );
  } catch (error) {
    console.error(error);
    showStatus(`A Vega-Lite chart could not render: ${error.message}`);
  }
}

renderAll();
