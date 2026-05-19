const statusEl = document.querySelector("#chart-status");

const colors = {
  blue: "#1f77b4",
  teal: "#1d8a8a",
  green: "#2f8f5b",
  orange: "#d9792b",
  red: "#c94c4c",
  purple: "#6b5fb5",
  text: "#142033",
  muted: "#607089"
};

function showStatus(message) {
  statusEl.textContent = message;
  statusEl.classList.add("is-visible");
}

function hideStatus() {
  statusEl.textContent = "";
  statusEl.classList.remove("is-visible");
}

function chartWidth(selector, fallback = 520) {
  const el = document.querySelector(selector);
  return Math.max(320, Math.floor((el?.clientWidth || fallback) - 4));
}

function baseConfig() {
  return {
    background: "#ffffff",
    font: "Arial",
    title: {
      font: "Arial",
      color: colors.text,
      subtitleFont: "Arial",
      subtitleColor: colors.muted,
      anchor: "start"
    },
    axis: {
      labelFont: "Arial",
      titleFont: "Arial",
      labelColor: "#34445c",
      titleColor: "#34445c",
      gridColor: "#e7eef5",
      domainColor: "#c8d8e7",
      tickColor: "#c8d8e7"
    },
    legend: {
      labelFont: "Arial",
      titleFont: "Arial",
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
  const mapHeight = 470;

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
  const tableWidth = Math.min(360, Math.max(310, Math.floor(width * 0.38)));
  const growthWidth = Math.min(160, Math.max(130, Math.floor(width * 0.18)));
  const barWidth = Math.max(360, width - tableWidth - growthWidth - 22);
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
  const chartHeight = 400;
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
                mark: { type: "image", width: 36, height: 24, align: "center", baseline: "middle" },
                encoding: {
                  x: { value: 18 },
                  y: { field: "Country", type: "nominal", sort: countrySort, axis: null, scale: rowScale },
                  url: { field: "Flag_Path", type: "nominal" }
                }
              },
              {
                mark: { type: "text", align: "left", baseline: "middle", fontSize: 14, fontWeight: "bold", color: "#1D4E89" },
                encoding: {
                  x: { value: 66 },
                  y: { field: "Country", type: "nominal", sort: countrySort, axis: null, scale: rowScale },
                  text: { field: "Flag", type: "nominal" }
                }
              },
              {
                mark: { type: "text", align: "left", baseline: "middle", fontSize: 20, fontWeight: 500, color: "#1F2937" },
                encoding: {
                  x: { value: 116 },
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
                mark: { type: "bar", size: 32, cornerRadiusEnd: 4 },
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
                mark: { type: "text", align: "left", dx: 8, baseline: "middle", fontWeight: 700, fontSize: 17, color: "#1F2937" },
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
            mark: { type: "text", align: "left", baseline: "middle", fontSize: 17, fontWeight: 700 },
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
            { label: "Steady Growth", color: "#2F7EBB", x: 108 },
            { label: "Fast Growth", color: "#2E9B9B", x: 260 },
            { label: "Surging Growth", color: "#3B9B5C", x: 400 }
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
      fontSize: 18,
      subtitleFontSize: 12
    },
    data: { url: "data/foreign_visitors_monthly_2024_2023.csv" },
    vconcat: [
      {
        width: chartWidth("#monthly-trend-chart"),
        height: 230,
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
        height: 86,
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
    width: Math.min(360, chartWidth("#transport-chart")),
    height: 330,
    title: {
      text: "Mode of Transport",
      subtitle: "Land dominates foreign visitor arrivals in 2024",
      fontSize: 18,
      subtitleFontSize: 12
    },
    data: { url: "data/mode_of_transport_2024_2023.csv" },
    layer: [
      {
        mark: { type: "arc", innerRadius: 78, outerRadius: 138, stroke: "#ffffff", strokeWidth: 2 },
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
        mark: { type: "text", align: "center", baseline: "middle", dy: -26, fontSize: 13, fontWeight: "bold", color: "#5d6878" },
        encoding: { text: { field: "label" } }
      },
      {
        data: { values: [{ mode: "Land" }] },
        mark: { type: "text", align: "center", baseline: "middle", dy: 4, fontSize: 28, fontWeight: "bold", color: "#2F9559" },
        encoding: { text: { field: "mode" } }
      },
      {
        data: { values: [{ share: "66.1%" }] },
        mark: { type: "text", align: "center", baseline: "middle", dy: 40, fontSize: 36, fontWeight: "bold", color: "#2F9559" },
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
    height: 355,
    title: {
      text: "Visitor Expenditure Mix",
      subtitle: "2024 value by category; colour shows year-on-year growth",
      fontSize: 18,
      subtitleFontSize: 12
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
    height: 355,
    title: {
      text: "Arrivals vs Receipts by Market",
      subtitle: "Bubble size indicates estimated RM per visitor",
      fontSize: 18,
      subtitleFontSize: 12
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
        mark: { type: "circle", opacity: 0.78, stroke: "#ffffff", strokeWidth: 1.2 },
        encoding: {
          x: { field: "Arrivals_Million", type: "quantitative", title: "Arrivals (million)" },
          y: { field: "Receipts_RM_Bil", type: "quantitative", title: "Receipts (RM billion)" },
          size: {
            field: "RM_Per_Visitor",
            type: "quantitative",
            title: "RM per visitor",
            scale: { range: [80, 1400] }
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
        transform: [{ filter: "datum.Rank <= 6 || datum.Country == 'Australia' || datum.Country == 'United Kingdom'" }],
        mark: { type: "text", dy: -12, fontSize: 11, fontWeight: "bold", color: colors.text },
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
  return {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    width: chartWidth("#state-guests-chart"),
    height: 360,
    title: {
      text: "Domestic vs Foreign Hotel Guests",
      subtitle: "State demand mix in 2024; size shows total hotel guests",
      fontSize: 18,
      subtitleFontSize: 12
    },
    data: { url: "data/international_arrivals_by_state_2024.csv" },
    transform: [
      { calculate: "datum.domestic_2024 / 1000000", as: "Domestic_Million" },
      { calculate: "datum.international_2024 / 1000000", as: "Foreign_Million" },
      { calculate: "datum.total_2024 / 1000000", as: "Total_Million" }
    ],
    layer: [
      {
        mark: { type: "circle", opacity: 0.78, stroke: "#ffffff", strokeWidth: 1.2 },
        encoding: {
          x: { field: "Domestic_Million", type: "quantitative", title: "Domestic guests (million)" },
          y: { field: "Foreign_Million", type: "quantitative", title: "Foreign guests (million)" },
          size: { field: "Total_Million", type: "quantitative", title: "Total guests (million)", scale: { range: [60, 1300] } },
          color: {
            field: "international_growth_pct",
            type: "quantitative",
            title: "Foreign growth %",
            scale: { domain: [-35, 75], range: [colors.red, "#d8c56a", colors.green] }
          },
          tooltip: [
            { field: "state", title: "State" },
            { field: "domestic_2024", title: "Domestic_2024", format: "," },
            { field: "international_2024", title: "Foreigner_2024", format: "," },
            { field: "international_growth_pct", title: "Foreign growth %", format: ".1f" }
          ]
        }
      },
      {
        transform: [{ filter: "datum.total_2024 >= 7000000 || datum.state == 'Kedah'" }],
        mark: { type: "text", dy: -12, fontSize: 11, fontWeight: "bold", color: colors.text },
        encoding: {
          x: { field: "Domestic_Million", type: "quantitative" },
          y: { field: "Foreign_Million", type: "quantitative" },
          text: { field: "state" }
        }
      }
    ],
    config: baseConfig()
  };
}

function capacityAorSpec() {
  return {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    width: chartWidth("#capacity-aor-chart"),
    height: 360,
    title: {
      text: "Accommodation Capacity vs Occupancy",
      subtitle: "Rooms and hotel count compared with 2024 average occupancy rate",
      fontSize: 18,
      subtitleFontSize: 12
    },
    data: { url: "data/hotel_capacity_aor_by_state_2024_2023.csv" },
    layer: [
      {
        mark: { type: "circle", opacity: 0.78, stroke: "#ffffff", strokeWidth: 1.2 },
        encoding: {
          x: { field: "Rooms_2024", type: "quantitative", title: "Rooms in 2024" },
          y: { field: "AOR_2024", type: "quantitative", title: "Average occupancy rate (%)", scale: { domain: [35, 80] } },
          size: { field: "Hotels_2024", type: "quantitative", title: "Hotels", scale: { range: [50, 1200] } },
          color: {
            field: "AOR_Difference",
            type: "quantitative",
            title: "AOR change",
            scale: { domain: [-1.5, 4], range: [colors.red, "#d8c56a", colors.green] }
          },
          tooltip: [
            { field: "State", title: "State" },
            { field: "Hotels_2024", title: "Hotels 2024", format: "," },
            { field: "Rooms_2024", title: "Rooms 2024", format: "," },
            { field: "AOR_2024", title: "AOR 2024", format: ".1f" },
            { field: "AOR_Difference", title: "AOR change", format: ".1f" }
          ]
        }
      },
      {
        transform: [{ filter: "datum.Rooms_2024 > 26000 || datum.AOR_2024 > 70" }],
        mark: { type: "text", dy: -12, fontSize: 11, fontWeight: "bold", color: colors.text },
        encoding: {
          x: { field: "Rooms_2024", type: "quantitative" },
          y: { field: "AOR_2024", type: "quantitative" },
          text: { field: "State" }
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
