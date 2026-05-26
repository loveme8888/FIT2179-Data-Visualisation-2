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

function chartWidth(selector, fallback = 720, min = 650) {
  const el = document.querySelector(selector);
  const responsiveMin = window.innerWidth < 760 ? 300 : min;
  return Math.max(responsiveMin, Math.floor((el?.clientWidth || fallback) - 4));
}

function baseConfig() {
  return {
    background: "#ffffff",
    font: "Inter",
    title: {
      font: "Bebas Neue",
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
  const width = chartWidth("#arrivals-map", 720, 700);
  const halfWidth = Math.floor((width - 4) / 2);
  const mapHeight = 350;

  const makeMapLayer = (region, showLegend) => ({
    width: halfWidth,
    height: mapHeight,
    projection: {
      type: "mercator",
      center: region === "Peninsular" ? [101.65, 4.05] : [115.1, 4.0],
      scale: region === "Peninsular" ? 3300 : 2050,
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
                  gradientLength: Math.min(440, width - 100),
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
  const width = chartWidth("#source-markets-chart", 720, 650);
  const tableWidth = Math.min(300, Math.max(230, Math.floor(width * 0.28)));
  const growthWidth = Math.min(150, Math.max(120, Math.floor(width * 0.14)));
  const barWidth = window.innerWidth < 760
    ? Math.max(180, width - tableWidth - growthWidth - 26)
    : Math.max(650, width - tableWidth - growthWidth - 26);
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
  const chartHeight = 330;
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
                mark: { type: "bar", size: 28, cornerRadiusEnd: 4 },
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
                mark: { type: "text", align: "left", dx: 8, baseline: "middle", fontWeight: 700, fontSize: 15, color: "#1F2937" },
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
  const width = chartWidth("#monthly-trend-chart", 760, 650);
  return {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    width,
    title: {
      text: "Monthly Foreign Visitors",
      subtitle: "Lines compare monthly arrivals; bars below show 2024 growth vs 2023",
      fontSize: 24,
      subtitleFontSize: 14
    },
    data: { url: "data/foreign_visitors_monthly_2024_2023.csv" },
    vconcat: [
      {
        width,
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
            type: "quantitative",
            title: null,
            scale: { domain: [1, 12] },
            axis: {
              values: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
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
        width,
        height: 90,
        mark: { type: "bar", cornerRadiusEnd: 3, size: 24, color: colors.green },
        encoding: {
          x: {
            field: "Month_Num",
            type: "quantitative",
            title: "Month",
            scale: { domain: [1, 12] },
            axis: {
              values: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
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
    width: Math.min(520, chartWidth("#transport-chart", 520, 360)),
    height: 300,
    title: {
      text: "Mode of Transport",
      subtitle: "Land dominates foreign visitor arrivals in 2024",
      fontSize: 24,
      subtitleFontSize: 14
    },
    data: { url: "data/mode_of_transport_2024_2023.csv" },
    layer: [
      {
        mark: { type: "arc", innerRadius: 78, outerRadius: 132, stroke: "#ffffff", strokeWidth: 3 },
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
        mark: { type: "text", align: "center", baseline: "middle", dy: 0, fontSize: 28, fontWeight: "bold", color: "#2F9559" },
        encoding: { text: { field: "mode" } }
      },
      {
        data: { values: [{ share: "66.1%" }] },
        mark: { type: "text", align: "center", baseline: "middle", dy: 34, fontSize: 34, fontWeight: "bold", color: "#2F9559" },
        encoding: { text: { field: "share" } }
      }
    ],
    config: baseConfig()
  };
}

function expenditureSpec() {
  return {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    width: chartWidth("#expenditure-chart", 760, 650),
    height: 330,
    title: {
      text: "Visitor Expenditure Mix",
      subtitle: "2024 value by category; colour highlights key expenditure categories",
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
        mark: { type: "bar", cornerRadiusEnd: 3, size: 26 },
        encoding: {
          y: { field: "Item", type: "nominal", sort: "-x", title: null },
          x: { field: "Value_2024_RM_Bil", type: "quantitative", title: "RM billion" },
          color: {
            condition: [
              { test: "datum.Item == 'Shopping'", value: "#D9A441" },
              { test: "datum.Item == 'Accommodation'", value: "#2E6DA4" },
              { test: "datum.Item == 'Food & Beverages'", value: "#5A8CCF" }
            ],
            value: "#DCE6F2"
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
          text: { field: "Value_2024_RM_Bil", type: "quantitative", format: ".1f" },
          color: { value: colors.text }
        }
      }
    ],
    config: baseConfig()
  };
}

function domesticKeyIndicatorsSpec() {
  return {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    width: chartWidth("#domestic-key-indicators-chart", 760, 650),
    height: 320,
    title: {
      text: "Domestic Tourism Key Indicators",
      subtitle: "Indexed to 2017 = 100 to compare indicators with different units",
      fontSize: 24,
      subtitleFontSize: 14
    },
    data: { url: "data/domestic_tourism_key_indicators_2017_2024.csv" },
    transform: [
      {
        filter: "datum.Indicator == 'Total Expenditure' || datum.Indicator == 'Number of Visitors' || datum.Indicator == 'Number of Tourism Trips' || datum.Indicator == 'Average Expenditure per Trip'"
      },
      {
        calculate: "datum.Indicator == 'Total Expenditure' ? datum.Value / 83102.6097829999 * 100 : datum.Indicator == 'Number of Visitors' ? datum.Value / 205408.349313615 * 100 : datum.Indicator == 'Number of Tourism Trips' ? datum.Value / 276147.263 * 100 : datum.Value / 300.936454365051 * 100",
        as: "Index_2017"
      }
    ],
    mark: { type: "line", point: { filled: true, size: 45 }, strokeWidth: 3 },
    encoding: {
      x: { field: "Year", type: "ordinal", title: "Year" },
      y: { field: "Index_2017", type: "quantitative", title: "Index (2017 = 100)" },
      color: {
        field: "Indicator",
        type: "nominal",
        title: null,
        scale: {
          domain: ["Total Expenditure", "Number of Visitors", "Number of Tourism Trips", "Average Expenditure per Trip"],
          range: ["#D9A441", "#2E6DA4", "#5A8CCF", "#2E8B57"]
        },
        legend: { orient: "bottom", direction: "horizontal", columns: 2 }
      },
      tooltip: [
        { field: "Indicator", title: "Indicator" },
        { field: "Year", title: "Year" },
        { field: "Value", title: "Value", format: ",.1f" },
        { field: "Unit", title: "Unit" },
        { field: "Index_2017", title: "Index", format: ".1f" }
      ]
    },
    config: baseConfig()
  };
}

function domesticStateVisitorsSpec() {
  return {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    width: chartWidth("#domestic-state-visitors-chart", 760, 650),
    height: 390,
    title: {
      text: "Domestic Visitors by State",
      subtitle: "Top visited states in 2024",
      fontSize: 24,
      subtitleFontSize: 14
    },
    data: { url: "data/domestic_visitors_by_state_2017_2024.csv" },
    transform: [
      { filter: "datum.Year == 2024 && datum.Is_Total == 'FALSE'" },
      { calculate: "datum.Domestic_Visitors_000 / 1000", as: "Domestic_Visitors_Million" },
      { window: [{ op: "rank", as: "Rank" }], sort: [{ field: "Domestic_Visitors_000", order: "descending" }] },
      { filter: "datum.Rank <= 12" }
    ],
    layer: [
      {
        mark: { type: "bar", cornerRadiusEnd: 3, size: 22 },
        encoding: {
          y: { field: "State", type: "nominal", sort: "-x", title: null },
          x: { field: "Domestic_Visitors_Million", type: "quantitative", title: "Domestic visitors (million)" },
          color: {
            condition: [
              { test: "datum.State == 'Selangor'", value: "#D9A441" },
              { test: "datum.State == 'W.P. Kuala Lumpur'", value: "#2E6DA4" },
              { test: "datum.State == 'Perak'", value: "#5A8CCF" }
            ],
            value: "#DCE6F2"
          },
          tooltip: [
            { field: "State", title: "State" },
            { field: "Domestic_Visitors_000", title: "Domestic visitors ('000)", format: ",.1f" }
          ]
        }
      },
      {
        mark: { type: "text", align: "left", dx: 6, baseline: "middle", fontWeight: "bold", color: colors.text },
        encoding: {
          y: { field: "State", type: "nominal", sort: "-x" },
          x: { field: "Domestic_Visitors_Million", type: "quantitative" },
          text: { field: "Domestic_Visitors_Million", type: "quantitative", format: ".1f" }
        }
      }
    ],
    config: baseConfig()
  };
}

function domesticExpenditureSpec() {
  return {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    width: chartWidth("#domestic-expenditure-chart", 760, 650),
    height: 310,
    title: {
      text: "Domestic Visitor Expenditure Mix",
      subtitle: "2024 expenditure by component",
      fontSize: 24,
      subtitleFontSize: 14
    },
    data: { url: "data/domestic_expenditure_components_2023_2024.csv" },
    transform: [
      { filter: "datum.Year == 2024 && datum.Row_Type == 'Component'" },
      { calculate: "datum.Expenditure_RM_Mil / 1000", as: "Expenditure_RM_Bil" }
    ],
    layer: [
      {
        mark: { type: "bar", cornerRadiusEnd: 3, size: 24 },
        encoding: {
          y: { field: "Component", type: "nominal", sort: "-x", title: null },
          x: { field: "Expenditure_RM_Bil", type: "quantitative", title: "RM billion" },
          color: {
            condition: [
              { test: "datum.Component == 'Shopping'", value: "#D9A441" },
              { test: "datum.Component == 'Food & Beverage'", value: "#5A8CCF" },
              { test: "datum.Component == 'Accommodation'", value: "#2E6DA4" }
            ],
            value: "#DCE6F2"
          },
          tooltip: [
            { field: "Component", title: "Component" },
            { field: "Expenditure_RM_Mil", title: "RM mil.", format: ",.1f" },
            { field: "Share_Pct", title: "Share %", format: ".1f" }
          ]
        }
      },
      {
        mark: { type: "text", align: "left", dx: 6, baseline: "middle", fontWeight: "bold", color: colors.text },
        encoding: {
          y: { field: "Component", type: "nominal", sort: "-x" },
          x: { field: "Expenditure_RM_Bil", type: "quantitative" },
          text: { field: "Expenditure_RM_Bil", type: "quantitative", format: ".1f" }
        }
      }
    ],
    config: baseConfig()
  };
}

function domesticPurposeSpec() {
  return {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    width: chartWidth("#domestic-purpose-chart", 760, 650),
    height: 300,
    title: {
      text: "Purpose of Domestic Trips",
      subtitle: "Share of domestic tourism trips in 2024",
      fontSize: 24,
      subtitleFontSize: 14
    },
    data: { url: "data/domestic_trip_purpose_2024.csv" },
    layer: [
      {
        mark: { type: "bar", cornerRadiusEnd: 3, size: 24 },
        encoding: {
          y: { field: "Purpose", type: "nominal", sort: "-x", title: null },
          x: { field: "Share_Pct", type: "quantitative", title: "Share of trips (%)" },
          color: {
            condition: [
              { test: "datum.Purpose == 'Visiting relatives & friends'", value: "#D9A441" },
              { test: "datum.Purpose == 'Shopping'", value: "#2E6DA4" },
              { test: "datum.Purpose == 'Holiday/ leisure/ relaxation'", value: "#5A8CCF" }
            ],
            value: "#DCE6F2"
          },
          tooltip: [
            { field: "Purpose", title: "Purpose" },
            { field: "Share_Pct", title: "Share %", format: ".1f" },
            { field: "Activity_1", title: "Top activity" }
          ]
        }
      },
      {
        mark: { type: "text", align: "left", dx: 6, baseline: "middle", fontWeight: "bold", color: colors.text },
        encoding: {
          y: { field: "Purpose", type: "nominal", sort: "-x" },
          x: { field: "Share_Pct", type: "quantitative" },
          text: { field: "Share_Pct", type: "quantitative", format: ".1f" }
        }
      }
    ],
    config: baseConfig()
  };
}

function domesticStructureSpec() {
  const width = chartWidth("#domestic-structure-chart", 760, 650);
  const halfWidth = Math.max(300, Math.floor((width - 30) / 2));

  return {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    hconcat: [
      {
        width: halfWidth,
        height: 280,
        title: {
          text: "Domestic Transport Mode",
          subtitle: "Visitors, 2024",
          fontSize: 22,
          subtitleFontSize: 13
        },
        data: { url: "data/domestic_transport_mode_2023_2024.csv" },
        transform: [
          { filter: "datum.Year == 2024 && datum.Visitor_Type == 'Visitors' && datum.Mode_Type == 'Aggregate mode'" }
        ],
        layer: [
          {
            mark: { type: "bar", cornerRadiusEnd: 3, size: 24 },
            encoding: {
              y: { field: "Mode", type: "nominal", sort: "-x", title: null },
              x: { field: "Share_Pct", type: "quantitative", title: "Share (%)", scale: { domain: [0, 100] } },
              color: {
                field: "Mode",
                type: "nominal",
                scale: { domain: ["Land", "Air", "Water"], range: ["#2E8B57", "#2E6DA4", "#5A8CCF"] },
                legend: null
              },
              tooltip: [
                { field: "Mode", title: "Mode" },
                { field: "Share_Pct", title: "Share %", format: ".1f" }
              ]
            }
          },
          {
            mark: { type: "text", align: "left", dx: 6, baseline: "middle", fontWeight: "bold", color: colors.text },
            encoding: {
              y: { field: "Mode", type: "nominal", sort: "-x" },
              x: { field: "Share_Pct", type: "quantitative", scale: { domain: [0, 100] } },
              text: { field: "Share_Pct", type: "quantitative", format: ".1f" }
            }
          }
        ]
      },
      {
        width: halfWidth,
        height: 280,
        title: {
          text: "Tourist Accommodation Type",
          subtitle: "Tourists, 2024",
          fontSize: 22,
          subtitleFontSize: 13
        },
        data: { url: "data/domestic_accommodation_type_2023_2024.csv" },
        transform: [
          { filter: "datum.Year == 2024 && datum.Row_Type == 'Accommodation type'" }
        ],
        layer: [
          {
            mark: { type: "bar", cornerRadiusEnd: 3, size: 22 },
            encoding: {
              y: { field: "Accommodation_Type", type: "nominal", sort: "-x", title: null },
              x: { field: "Share_Pct", type: "quantitative", title: "Share (%)", scale: { domain: [0, 65] } },
              color: {
                condition: [
                  { test: "datum.Accommodation_Type == \"Relatives' & Friends' House\"", value: "#D9A441" },
                  { test: "datum.Accommodation_Type == 'Hotel'", value: "#2E6DA4" }
                ],
                value: "#DCE6F2"
              },
              tooltip: [
                { field: "Accommodation_Type", title: "Type" },
                { field: "Share_Pct", title: "Share %", format: ".1f" }
              ]
            }
          },
          {
            mark: { type: "text", align: "left", dx: 6, baseline: "middle", fontWeight: "bold", color: colors.text },
            encoding: {
              y: { field: "Accommodation_Type", type: "nominal", sort: "-x" },
              x: { field: "Share_Pct", type: "quantitative", scale: { domain: [0, 65] } },
              text: { field: "Share_Pct", type: "quantitative", format: ".1f" }
            }
          }
        ]
      }
    ],
    spacing: 30,
    config: baseConfig()
  };
}

function domesticODSpec() {
  return {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    width: chartWidth("#domestic-od-chart", 760, 650),
    height: 430,
    title: {
      text: "Domestic Tourist Origin-Destination Flow",
      subtitle: "State of origin by state visited, 2024 ('000 tourists)",
      fontSize: 24,
      subtitleFontSize: 14
    },
    data: { url: "data/domestic_tourists_origin_destination_2024.csv" },
    transform: [
      { filter: "datum.Is_Origin_Total == 'FALSE' && datum.Is_Destination_Total == 'FALSE'" }
    ],
    mark: { type: "rect", stroke: "#ffffff", strokeWidth: 0.5 },
    encoding: {
      x: { field: "Destination_State", type: "nominal", title: "Destination state", axis: { labelAngle: -45, labelLimit: 95 } },
      y: { field: "Origin_State", type: "nominal", title: "Origin state" },
      color: {
        field: "Tourists_000",
        type: "quantitative",
        title: "Tourists ('000)",
        scale: { scheme: "blues", type: "sqrt" }
      },
      tooltip: [
        { field: "Origin_State", title: "Origin" },
        { field: "Destination_State", title: "Destination" },
        { field: "Tourists_000", title: "Tourists ('000)", format: ",.1f" }
      ]
    },
    config: baseConfig()
  };
}

function domesticTopDestinationsSpec() {
  const selectedStates = ["Selangor", "W.P. Kuala Lumpur", "Sabah", "Pahang", "Pulau Pinang", "Johor"];
  return {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    width: chartWidth("#domestic-top-destinations-chart", 760, 650),
    height: 260,
    title: {
      text: "High-Volume Domestic Destination Appeal",
      subtitle: "Top visited places in selected destination states",
      fontSize: 24,
      subtitleFontSize: 14
    },
    data: { url: "data/domestic_top_destinations_by_state_2024.csv" },
    transform: [
      { filter: `indexof(${JSON.stringify(selectedStates)}, datum.State) >= 0` },
      { calculate: "datum.Rank + '. ' + datum.Destination", as: "Destination_Label" }
    ],
    mark: { type: "text", align: "left", baseline: "middle", fontSize: 12.5, color: colors.text },
    encoding: {
      y: { field: "State", type: "nominal", sort: selectedStates, title: null },
      x: { field: "Rank", type: "ordinal", title: "Rank", axis: { labelAngle: 0 } },
      text: { field: "Destination_Label", type: "nominal" },
      tooltip: [
        { field: "State", title: "State" },
        { field: "Rank", title: "Rank" },
        { field: "Destination", title: "Destination" }
      ]
    },
    config: baseConfig()
  };
}

function receiptsScatterSpec() {
  const keyMarketFilter = "datum.Country == 'Singapore' || datum.Country == 'China' || datum.Country == 'Indonesia' || datum.Country == 'India' || datum.Country == 'Thailand'";

  return {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    width: chartWidth("#receipts-scatter-chart", 760, 650),
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
            { x: 9, y: 24, label: "High arrivals + high receipts" },
            { x: 1.25, y: 24, label: "Lower arrivals + high receipts" },
            { x: 9, y: 4.8, label: "High arrivals + lower receipts" },
            { x: 1.25, y: 4.8, label: "Emerging value markets" }
          ]
        },
        mark: { type: "text", align: "center", baseline: "middle", fontSize: 12, fontWeight: "bold", color: "#8b9bb0", opacity: 0.55 },
        encoding: {
          x: { field: "x", type: "quantitative", scale: { type: "sqrt", domain: [0, 20] } },
          y: { field: "y", type: "quantitative" },
          text: { field: "label" }
        }
      },
      {
        mark: { type: "rule", strokeDash: [6, 5], strokeWidth: 1.2, color: "#b8cbe0" },
        encoding: { x: { datum: 3, type: "quantitative", scale: { type: "sqrt", domain: [0, 20] } } }
      },
      {
        mark: { type: "rule", strokeDash: [6, 5], strokeWidth: 1.2, color: "#b8cbe0" },
        encoding: { y: { datum: 8, type: "quantitative" } }
      },
      {
        mark: { type: "circle", opacity: 0.82, stroke: "#ffffff", strokeWidth: 1.4 },
        encoding: {
          x: {
            field: "Arrivals_Million",
            type: "quantitative",
            title: "Arrivals (million, sqrt scale)",
            scale: { type: "sqrt", domain: [0, 20] },
            axis: { values: [0, 0.5, 1, 2, 3, 5, 10, 15, 20] }
          },
          y: { field: "Receipts_RM_Bil", type: "quantitative", title: "Receipts (RM billion)", scale: { domain: [0, 30] } },
          size: {
            field: "RM_Per_Visitor",
            type: "quantitative",
            title: "RM per visitor",
            scale: { range: [80, 1800] },
            legend: {
              orient: "bottom",
              direction: "horizontal",
              values: [1000, 3000, 5000],
              titleFontSize: 11,
              labelFontSize: 10,
              symbolStrokeWidth: 0
            }
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
        transform: [{ filter: keyMarketFilter }],
        mark: { type: "text", dy: -16, fontSize: 14, fontWeight: "bold", color: colors.text },
        encoding: {
          x: { field: "Arrivals_Million", type: "quantitative", scale: { type: "sqrt", domain: [0, 20] } },
          y: { field: "Receipts_RM_Bil", type: "quantitative" },
          text: { field: "Country" }
        }
      },
      {
        data: {
          values: [{ x: 18.9, y: 27.9, note: "Highest arrivals and receipts" }]
        },
        mark: { type: "text", align: "right", baseline: "middle", dx: -18, dy: 22, fontSize: 12, fontWeight: 700, color: "#2b405c" },
        encoding: {
          x: { field: "x", type: "quantitative", scale: { type: "sqrt", domain: [0, 20] } },
          y: { field: "y", type: "quantitative" },
          text: { field: "note" }
        }
      },
      {
        data: {
          values: [{ x: 3.7, y: 20.9, note: "High-value growth market" }]
        },
        mark: { type: "text", align: "left", baseline: "middle", dx: 18, dy: -8, fontSize: 12, fontWeight: 700, color: "#2b405c" },
        encoding: {
          x: { field: "x", type: "quantitative", scale: { type: "sqrt", domain: [0, 20] } },
          y: { field: "y", type: "quantitative" },
          text: { field: "note" }
        }
      }
    ],
    config: baseConfig()
  };
}

function stateGuestsSpec() {
  const width = chartWidth("#state-guests-chart", 720, 700);
  const halfWidth = Math.floor((width - 4) / 2);
  const mapHeight = 350;
  const peninsularCodes = ["KDH", "KTN", "PRK", "PNG", "KUL", "NSN", "MLK", "PLS", "PHG", "TRG", "PJY", "SGR", "JHR"];

  const growthMapLayer = (region, showLegend) => ({
    width: halfWidth,
    height: mapHeight,
    projection: {
      type: "mercator",
      center: region === "Peninsular" ? [101.65, 4.05] : [115.1, 4.0],
      scale: region === "Peninsular" ? 3300 : 2050,
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
        legend: showLegend ? { orient: "bottom", direction: "horizontal", gradientLength: Math.min(440, width - 100), format: ".0f" } : null
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
    width: chartWidth("#capacity-aor-chart", 760, 650),
    height: 360,
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
        mark: { type: "text", align: "center", baseline: "middle", fontSize: 15, fontWeight: "bold", color: "#8b9bb0", opacity: 0.78 },
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
          size: { field: "Total_Million", type: "quantitative", title: "Total hotel guests (million)", scale: { range: [260, 4200] } },
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
        mark: { type: "text", dy: -16, fontSize: 14, fontWeight: "bold", color: colors.text },
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
  ["#monthly-trend-chart", monthlyTrendSpec],
  ["#domestic-key-indicators-chart", domesticKeyIndicatorsSpec],
  ["#source-markets-chart", sourceMarketsSpec],
  ["#receipts-scatter-chart", receiptsScatterSpec],
  ["#arrivals-map", mapSpec],
  ["#domestic-state-visitors-chart", domesticStateVisitorsSpec],
  ["#expenditure-chart", expenditureSpec],
  ["#domestic-expenditure-chart", domesticExpenditureSpec],
  ["#domestic-purpose-chart", domesticPurposeSpec],
  ["#domestic-structure-chart", domesticStructureSpec],
  ["#domestic-od-chart", domesticODSpec],
  ["#state-guests-chart", stateGuestsSpec],
  ["#capacity-aor-chart", capacityAorSpec],
  ["#domestic-top-destinations-chart", domesticTopDestinationsSpec]
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
