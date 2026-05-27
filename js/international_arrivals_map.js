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

const figureNarratives = {
  "monthly-trend-chart": {
    number: "FIGURE 01",
    title: "Monthly foreign arrivals rose across the full 2024 cycle",
    body: "The radial profile shows 2024 sitting outside 2023 in every month, with stronger mid-year and year-end demand."
  },
  "domestic-key-indicators-chart": {
    number: "FIGURE 02",
    title: "Domestic tourism recovered into a higher-spending pattern",
    body: "Indexed indicators make trips, visitors, average spending, and total expenditure comparable across time."
  },
  "source-markets-chart": {
    number: "FIGURE 03",
    title: "Regional source markets anchor Malaysia's inbound volume",
    body: "Singapore dominates arrivals, while growth colours show which smaller markets expanded fastest in 2024."
  },
  "receipts-scatter-chart": {
    number: "FIGURE 04",
    title: "Market value does not move in perfect proportion to arrivals",
    body: "The bubble chart compares arrival scale with receipts, highlighting markets that deliver higher value per visitor."
  },
  "arrivals-map": {
    number: "FIGURE 05",
    title: "Foreign hotel guests concentrate in gateway states",
    body: "The state map separates Peninsular Malaysia and Borneo so high-volume inbound destinations remain legible."
  },
  "domestic-state-visitors-chart": {
    number: "FIGURE 06",
    title: "Domestic visitors spread across a broader set of states",
    body: "Selangor leads domestic visitor volume, with Kuala Lumpur, Perak, and other large states forming the next tier."
  },
  "expenditure-chart": {
    number: "FIGURE 07",
    title: "Shopping is the largest international visitor spend category",
    body: "The expenditure mix shows how visitor value is distributed across retail, accommodation, food, and other items."
  },
  "domestic-expenditure-chart": {
    number: "FIGURE 08",
    title: "Domestic expenditure has a similar retail-led structure",
    body: "Domestic spending is led by shopping and food, showing where local travel feeds the tourism economy."
  },
  "domestic-purpose-chart": {
    number: "FIGURE 09",
    title: "Domestic trips are strongly social and everyday in nature",
    body: "Visiting relatives and friends leads the purpose mix, ahead of shopping and leisure travel."
  },
  "domestic-structure-chart": {
    number: "FIGURE 10",
    title: "Domestic travel relies on land movement and informal stays",
    body: "Transport and accommodation charts show road-oriented movement and heavy use of relatives' and friends' homes."
  },
  "domestic-od-chart": {
    number: "FIGURE 11",
    title: "Origin-destination flows reveal state-to-state travel corridors",
    body: "The heatmap shows where domestic tourists came from and which destination states they visited in 2024."
  },
  "state-guests-chart": {
    number: "FIGURE 12",
    title: "Growth opportunities appear beyond the largest bases",
    body: "State growth rates identify where foreign hotel guest momentum strengthened most sharply year on year."
  },
  "capacity-aor-chart": {
    number: "FIGURE 13",
    title: "Scale and growth together separate mature and emerging states",
    body: "The quadrant view compares foreign hotel guest volume with growth to distinguish established demand from momentum."
  },
  "domestic-top-destinations-chart": {
    number: "FIGURE 14",
    title: "Recognizable attractions support domestic destination appeal",
    body: "Selected high-volume states are paired with their top visited places to connect demand with actual destinations."
  }
};

function applyFigureNarratives() {
  Object.entries(figureNarratives).forEach(([chartId, narrative]) => {
    const chart = document.getElementById(chartId);
    const card = chart?.closest(".viz-card");
    if (!chart || !card || card.querySelector(".figure-copy")) return;

    card.classList.add("figure-card", `figure-card-${chartId}`);

    const copy = document.createElement("div");
    copy.className = "figure-copy";
    copy.innerHTML = `
      <span class="figure-label">${narrative.number}</span>
      <h3>${narrative.title}</h3>
      <p>${narrative.body}</p>
      ${chartId === "monthly-trend-chart" ? `
        <div class="figure-kpi-card" aria-label="Foreign arrivals summary">
          <div class="figure-kpi-growth">
            <span>+27.6%</span>
            <small>Growth in 2024 vs 2023</small>
          </div>
          <div class="figure-kpi-totals">
            <div><strong>29.0M</strong><span>2023 visitors</span></div>
            <div><strong>37.0M</strong><span>2024 visitors</span></div>
          </div>
        </div>
      ` : ""}
    `;
    card.insertBefore(copy, card.firstElementChild);
  });
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
  const isMobile = window.innerWidth < 760;
  const size = isMobile
    ? Math.min(Math.max(250, width - 78), 300)
    : Math.min(Math.max(460, width - 90), 580);
  const height = size + (isMobile ? 190 : 46);
  return {
    $schema: "https://vega.github.io/schema/vega/v5.json",
    width: size,
    height,
    padding: { top: 18, right: isMobile ? 18 : 28, bottom: 12, left: isMobile ? 18 : 28 },
    signals: [
      { name: "cx", update: "width / 2" },
      { name: "cy", update: "width / 2 + (width < 340 ? 34 : 22)" },
      { name: "innerRadius", value: 10 },
      { name: "outerRadius", update: "width * (width < 340 ? 0.31 : 0.34)" },
      { name: "legendCardWidth", update: "width < 340 ? 190 : 134" },
      { name: "maxVisitors", value: 4 },
      {
        name: "selectedYear",
        value: null,
        on: [
          { events: "@legend2023:click, @area2023:click, @hit2023:click, @line2023:click, @points2023:click", update: "selectedYear === '2023' ? null : '2023'" },
          { events: "@legend2024:click, @area2024:click, @hit2024:click, @line2024:click, @points2024:click", update: "selectedYear === '2024' ? null : '2024'" }
        ]
      }
    ],
    data: [
      {
        name: "legendControls",
        values: [
          { year: "2023", offset: -72, color: "#2E6DA4" },
          { year: "2024", offset: 8, color: "#E85D04" }
        ]
      },
      {
        name: "monthly",
        url: "data/foreign_visitors_monthly_2024_2023.csv",
        format: {
          type: "csv",
          parse: {
            Month_Num: "number",
            Visitors_2023: "number",
            Visitors_2024: "number",
            Growth_Pct: "number"
          }
        },
        transform: [
          { type: "formula", as: "Month_Abbr", expr: "['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][datum.Month_Num - 1]" },
          { type: "formula", as: "angle", expr: "(datum.Month_Num - 1) / 12 * 2 * PI - PI / 2" },
          { type: "formula", as: "isBottom", expr: "sin(datum.angle) > 0.72" }
        ]
      },
      {
        name: "visitors",
        source: "monthly",
        transform: [
          { type: "fold", fields: ["Visitors_2023", "Visitors_2024"], as: ["Year_Field", "Visitors"] },
          { type: "formula", as: "Year_Label", expr: "datum.Year_Field === 'Visitors_2024' ? '2024' : '2023'" },
          { type: "formula", as: "Visitors_Million", expr: "datum.Visitors / 1000000" },
          { type: "formula", as: "r", expr: "innerRadius + min(datum.Visitors_Million, maxVisitors) / maxVisitors * (outerRadius - innerRadius)" },
          { type: "formula", as: "x", expr: "cx + datum.r * cos(datum.angle)" },
          { type: "formula", as: "y", expr: "cy + datum.r * sin(datum.angle)" }
        ]
      },
      {
        name: "visitors2023",
        source: "visitors",
        transform: [
          { type: "filter", expr: "datum.Year_Label === '2023'" }
        ]
      },
      {
        name: "visitors2024",
        source: "visitors",
        transform: [
          { type: "filter", expr: "datum.Year_Label === '2024'" }
        ]
      },
      {
        name: "monthLabels",
        source: "monthly",
        transform: [
          { type: "formula", as: "x", expr: "cx + (outerRadius + 34) * cos(datum.angle)" },
          { type: "formula", as: "y", expr: "cy + (outerRadius + 34) * sin(datum.angle)" },
          { type: "formula", as: "valueX", expr: "cx + (outerRadius + 34) * cos(datum.angle)" },
          { type: "formula", as: "valueY", expr: "cy + (outerRadius + 34) * sin(datum.angle) + (sin(datum.angle) < -0.75 ? -22 : (datum.isBottom ? 26 : 24))" },
          { type: "formula", as: "Visitors_2024_Million", expr: "datum.Visitors_2024 / 1000000" },
          { type: "formula", as: "Visitors_2024_Label", expr: "format(datum.Visitors_2024_Million, '.1f') + 'M'" },
          { type: "formula", as: "align", expr: "abs(cos(datum.angle)) < 0.15 ? 'center' : cos(datum.angle) > 0 ? 'left' : 'right'" },
          { type: "formula", as: "baseline", expr: "abs(sin(datum.angle)) < 0.15 ? 'middle' : sin(datum.angle) > 0 ? 'top' : 'bottom'" }
        ]
      },
      {
        name: "spokes",
        source: "monthly",
        transform: [
          { type: "formula", as: "x1", expr: "cx + 8 * cos(datum.angle)" },
          { type: "formula", as: "y1", expr: "cy + 8 * sin(datum.angle)" },
          { type: "formula", as: "x2", expr: "cx + outerRadius * cos(datum.angle)" },
          { type: "formula", as: "y2", expr: "cy + outerRadius * sin(datum.angle)" }
        ]
      },
      {
        name: "eventLegend",
        values: [
          { color: "#2E8B57", label: "Dec: year-end\\nholiday peak", legendX: 0.17, legendRow: 0, bg: "#E8F3EC" },
          { color: "#F4A000", label: "Aug: mid-year\\nschool holidays", legendX: 0.50, legendRow: 1, bg: "#FFF3D8" },
          { color: "#E85D04", label: "Jun: school holidays\\ntravel boost", legendX: 0.83, legendRow: 2, bg: "#FDE9DC" }
        ],
        transform: [
          { type: "formula", as: "legendCenterX", expr: "width < 340 ? width / 2 : width * datum.legendX" },
          { type: "formula", as: "legendY", expr: "width < 340 ? height - 112 + datum.legendRow * 38 : height - 26" }
        ]
      },
      {
        name: "eventCallouts",
        values: [
          {
            Month_Num: 12,
            value: 3.805306,
            color: "#2E8B57",
            bg: "#E8F3EC",
            icon: "🎄",
            title: "DECEMBER\\nYEAR-END PEAK",
            detail: "Highest arrivals\\nat 3.8 million",
            anchor: "topLeft"
          },
          {
            Month_Num: 8,
            value: 3.662108,
            color: "#F4A000",
            bg: "#FFF3D8",
            icon: "☀",
            title: "AUGUST\\nMID-YEAR PEAK",
            detail: "School holidays\\nlifted demand",
            anchor: "bottomLeft"
          },
          {
            Month_Num: 6,
            value: 3.40929,
            color: "#E85D04",
            bg: "#FDE9DC",
            icon: "🚌",
            title: "JUNE\\nSCHOOL HOLIDAY\\nSURGE",
            detail: "Holiday travel\\nboosted arrivals",
            anchor: "bottomRight"
          }
        ],
        transform: [
          { type: "formula", as: "angle", expr: "(datum.Month_Num - 1) / 12 * 2 * PI - PI / 2" },
          { type: "formula", as: "r", expr: "innerRadius + datum.value / maxVisitors * (outerRadius - innerRadius)" },
          { type: "formula", as: "x", expr: "cx + datum.r * cos(datum.angle)" },
          { type: "formula", as: "y", expr: "cy + datum.r * sin(datum.angle)" },
          { type: "formula", as: "cardW", expr: "width < 520 ? 146 : 166" },
          { type: "formula", as: "cardH", expr: "width < 520 ? 72 : 82" },
          { type: "formula", as: "cardX", expr: "datum.anchor === 'bottomRight' ? width - datum.cardW : (datum.anchor === 'topLeft' ? 0 : 8)" },
          { type: "formula", as: "cardY", expr: "datum.anchor === 'topLeft' ? 0 : height - datum.cardH - 2" },
          { type: "formula", as: "leaderX", expr: "datum.anchor === 'bottomRight' ? datum.cardX : datum.cardX + datum.cardW" },
          { type: "formula", as: "leaderY", expr: "datum.cardY + datum.cardH / 2" }
        ]
      },
      {
        name: "rings",
        values: [{ value: 1 }, { value: 2 }, { value: 3 }, { value: 4 }],
        transform: [
          { type: "formula", as: "r", expr: "innerRadius + datum.value / maxVisitors * (outerRadius - innerRadius)" },
          { type: "formula", as: "labelX", expr: "cx + 7" },
          { type: "formula", as: "labelY", expr: "cy - datum.r + 1" }
        ]
      }
    ],
    scales: [
      { name: "yearColor", type: "ordinal", domain: ["2023", "2024"], range: [colors.blue, "#E85D04"] }
    ],
    marks: [
      {
        type: "rule",
        from: { data: "legendControls" },
        encode: {
          enter: {
            y: { value: 22 },
            x: { signal: "cx + datum.offset" },
            x2: { signal: "cx + datum.offset + 22" },
            stroke: { field: "color" },
            strokeWidth: { value: 3 },
            cursor: { value: "pointer" }
          },
          update: {
            strokeWidth: { signal: "selectedYear === datum.year ? 4 : 3" },
            opacity: { signal: "!selectedYear || selectedYear === datum.year ? 1 : 0.25" }
          }
        }
      },
      {
        type: "text",
        from: { data: "legendControls" },
        encode: {
          enter: {
            y: { value: 23 },
            x: { signal: "cx + datum.offset + 32" },
            text: { field: "year" },
            font: { value: "Inter" },
            fontSize: { value: 13 },
            fill: { value: "#34445c" },
            align: { value: "left" },
            baseline: { value: "middle" },
            cursor: { value: "pointer" }
          },
          update: {
            fontWeight: { signal: "selectedYear === datum.year ? 800 : 400" },
            opacity: { signal: "!selectedYear || selectedYear === datum.year ? 1 : 0.35" }
          }
        }
      },
      {
        name: "legend2023",
        type: "rect",
        encode: {
          enter: {
            x: { signal: "cx - 78" },
            y: { value: 10 },
            width: { value: 72 },
            height: { value: 24 },
            fill: { value: "#ffffff" },
            fillOpacity: { value: 0.001 },
            cursor: { value: "pointer" }
          }
        }
      },
      {
        name: "legend2024",
        type: "rect",
        encode: {
          enter: {
            x: { signal: "cx + 2" },
            y: { value: 10 },
            width: { value: 72 },
            height: { value: 24 },
            fill: { value: "#ffffff" },
            fillOpacity: { value: 0.001 },
            cursor: { value: "pointer" }
          }
        }
      },
      {
        type: "arc",
        from: { data: "rings" },
        encode: {
          enter: {
            x: { signal: "cx" },
            y: { signal: "cy" },
            startAngle: { value: 0 },
            endAngle: { signal: "2 * PI" },
            fill: { value: null },
            stroke: { value: "#dbe6f2" },
            strokeWidth: { value: 1.5 }
          },
          update: {
            innerRadius: { field: "r" },
            outerRadius: { signal: "datum.r + 0.6" }
          }
        }
      },
      {
        type: "rule",
        from: { data: "spokes" },
        encode: {
          enter: {
            stroke: { value: "#e8f0f8" },
            strokeWidth: { value: 1.2 }
          },
          update: {
            x: { field: "x1" },
            y: { field: "y1" },
            x2: { field: "x2" },
            y2: { field: "y2" }
          }
        }
      },
      {
        name: "area2023",
        type: "line",
        from: { data: "visitors2023" },
        sort: { field: "Month_Num" },
        encode: {
          enter: {
            interpolate: { value: "linear-closed" },
            fill: { value: colors.blue },
            fillOpacity: { value: 0.1 },
            stroke: { value: null },
            cursor: { value: "pointer" }
          },
          update: {
            x: { field: "x" },
            y: { field: "y" },
            fillOpacity: { signal: "selectedYear === '2023' ? 0.2 : (!selectedYear ? 0.1 : 0.03)" }
          }
        }
      },
      {
        name: "area2024",
        type: "line",
        from: { data: "visitors2024" },
        sort: { field: "Month_Num" },
        encode: {
          enter: {
            interpolate: { value: "linear-closed" },
            fill: { value: "#E85D04" },
            fillOpacity: { value: 0.1 },
            stroke: { value: null },
            cursor: { value: "pointer" }
          },
          update: {
            x: { field: "x" },
            y: { field: "y" },
            fillOpacity: { signal: "selectedYear === '2024' ? 0.2 : (!selectedYear ? 0.1 : 0.03)" }
          }
        }
      },
      {
        name: "line2023",
        type: "line",
        from: { data: "visitors2023" },
        sort: { field: "Month_Num" },
        encode: {
          enter: {
            interpolate: { value: "linear-closed" },
            stroke: { value: colors.blue },
            strokeWidth: { value: 4 },
            strokeJoin: { value: "round" },
            fill: { value: null },
            cursor: { value: "pointer" }
          },
          update: {
            x: { field: "x" },
            y: { field: "y" },
            strokeWidth: { signal: "selectedYear === '2023' ? 6 : 4" },
            opacity: { signal: "!selectedYear || selectedYear === '2023' ? 1 : 0.25" }
          }
        }
      },
      {
        name: "hit2023",
        type: "line",
        from: { data: "visitors2023" },
        sort: { field: "Month_Num" },
        encode: {
          enter: {
            interpolate: { value: "linear-closed" },
            stroke: { value: colors.blue },
            strokeOpacity: { value: 0.001 },
            strokeWidth: { value: 22 },
            strokeJoin: { value: "round" },
            fill: { value: null },
            cursor: { value: "pointer" }
          },
          update: {
            x: { field: "x" },
            y: { field: "y" }
          }
        }
      },
      {
        name: "line2024",
        type: "line",
        from: { data: "visitors2024" },
        sort: { field: "Month_Num" },
        encode: {
          enter: {
            interpolate: { value: "linear-closed" },
            stroke: { value: "#E85D04" },
            strokeWidth: { value: 4 },
            strokeJoin: { value: "round" },
            fill: { value: null },
            cursor: { value: "pointer" }
          },
          update: {
            x: { field: "x" },
            y: { field: "y" },
            strokeWidth: { signal: "selectedYear === '2024' ? 6 : 4" },
            opacity: { signal: "!selectedYear || selectedYear === '2024' ? 1 : 0.25" }
          }
        }
      },
      {
        name: "hit2024",
        type: "line",
        from: { data: "visitors2024" },
        sort: { field: "Month_Num" },
        encode: {
          enter: {
            interpolate: { value: "linear-closed" },
            stroke: { value: "#E85D04" },
            strokeOpacity: { value: 0.001 },
            strokeWidth: { value: 22 },
            strokeJoin: { value: "round" },
            fill: { value: null },
            cursor: { value: "pointer" }
          },
          update: {
            x: { field: "x" },
            y: { field: "y" }
          }
        }
      },
      {
        name: "points2023",
        type: "symbol",
        from: { data: "visitors2023" },
        encode: {
          enter: {
            size: { value: 105 },
            fill: { value: colors.blue },
            stroke: { value: "#ffffff" },
            strokeWidth: { value: 1.5 },
            cursor: { value: "pointer" },
            tooltip: {
              signal: "{'Month': datum.Month, 'Year': datum.Year_Label, 'Visitors': format(datum.Visitors, ',.0f'), 'Visitors (million)': format(datum.Visitors_Million, '.2f')}"
            }
          },
          update: {
            x: { field: "x" },
            y: { field: "y" },
            size: { signal: "selectedYear === '2023' ? 155 : 105" },
            opacity: { signal: "!selectedYear || selectedYear === '2023' ? 1 : 0.25" }
          }
        }
      },
      {
        name: "points2024",
        type: "symbol",
        from: { data: "visitors2024" },
        encode: {
          enter: {
            size: { value: 105 },
            fill: { value: "#E85D04" },
            stroke: { value: "#ffffff" },
            strokeWidth: { value: 1.5 },
            cursor: { value: "pointer" },
            tooltip: {
              signal: "{'Month': datum.Month, 'Year': datum.Year_Label, 'Visitors': format(datum.Visitors, ',.0f'), 'Visitors (million)': format(datum.Visitors_Million, '.2f')}"
            }
          },
          update: {
            x: { field: "x" },
            y: { field: "y" },
            size: { signal: "selectedYear === '2024' ? 155 : 105" },
            opacity: { signal: "!selectedYear || selectedYear === '2024' ? 1 : 0.25" }
          }
        }
      },
      {
        type: "symbol",
        from: { data: "eventCallouts" },
        encode: {
          enter: {
            shape: { value: "circle" },
            size: { value: 920 },
            fill: { field: "color" },
            fillOpacity: { value: 0.18 },
            stroke: { value: null }
          },
          update: {
            x: { field: "x" },
            y: { field: "y" },
            opacity: { signal: "width < 340 ? 0 : 1" }
          }
        }
      },
      {
        type: "symbol",
        from: { data: "eventCallouts" },
        encode: {
          enter: {
            shape: { value: "circle" },
            size: { value: 220 },
            fill: { value: "#E85D04" },
            stroke: { value: "#ffffff" },
            strokeWidth: { value: 3 }
          },
          update: {
            x: { field: "x" },
            y: { field: "y" },
            opacity: { signal: "width < 340 ? 0 : 1" }
          }
        }
      },
      {
        type: "text",
        from: { data: "monthLabels" },
        encode: {
          enter: {
            text: { field: "Month_Abbr" },
            font: { value: "Inter" },
            fontSize: { value: 15 },
            fontWeight: { value: 700 },
            fill: { value: colors.text }
          },
          update: {
            x: { field: "x" },
            y: { field: "y" },
            align: { field: "align" },
            baseline: { field: "baseline" }
          }
        }
      },
      {
        type: "text",
        from: { data: "monthLabels" },
        encode: {
          enter: {
            text: { field: "Visitors_2024_Label" },
            font: { value: "Inter" },
            fontSize: { value: 12 },
            fontWeight: { value: 700 },
            fill: { value: "#E85D04" }
          },
          update: {
            x: { field: "valueX" },
            y: { field: "valueY" },
            align: { field: "align" },
            baseline: { field: "baseline" },
            opacity: { signal: "!selectedYear || selectedYear === '2024' ? 1 : 0.25" }
          }
        }
      },
      {
        type: "rect",
        from: { data: "eventLegend" },
        encode: {
          enter: {
            width: { signal: "legendCardWidth" },
            height: { signal: "width < 340 ? 34 : 40" },
            cornerRadius: { value: 7 },
            fill: { field: "bg" },
            fillOpacity: { value: 0.95 }
          },
          update: {
            x: { signal: "datum.legendCenterX - legendCardWidth / 2" },
            y: { signal: "datum.legendY - (width < 340 ? 17 : 20)" },
            opacity: { signal: "width < 340 ? 1 : 0" }
          }
        }
      },
      {
        type: "rect",
        from: { data: "eventLegend" },
        encode: {
          enter: {
            width: { value: 5 },
            height: { signal: "width < 340 ? 24 : 24" },
            cornerRadius: { value: 3 },
            fill: { field: "color" }
          },
          update: {
            x: { signal: "datum.legendCenterX - legendCardWidth / 2 + 14" },
            y: { signal: "datum.legendY - 12" },
            opacity: { signal: "width < 340 ? 1 : 0" }
          }
        }
      },
      {
        type: "text",
        from: { data: "eventLegend" },
        encode: {
          enter: {
            text: { field: "label" },
            font: { value: "Inter" },
            fontSize: { value: 10.5 },
            fill: { value: colors.text },
            align: { value: "left" },
            baseline: { value: "middle" },
            limit: { signal: "legendCardWidth - 34" },
            lineBreak: { value: "\\n" }
          },
          update: {
            x: { signal: "datum.legendCenterX - legendCardWidth / 2 + 28" },
            y: { field: "legendY" },
            opacity: { signal: "width < 340 ? 1 : 0" }
          }
        }
      },
      {
        type: "rule",
        from: { data: "eventCallouts" },
        encode: {
          enter: {
            stroke: { field: "color" },
            strokeWidth: { value: 1.3 },
            strokeOpacity: { value: 0.65 }
          },
          update: {
            x: { field: "leaderX" },
            y: { field: "leaderY" },
            x2: { field: "x" },
            y2: { field: "y" },
            opacity: { value: 0 }
          }
        }
      },
      {
        type: "rect",
        from: { data: "eventCallouts" },
        encode: {
          enter: {
            cornerRadius: { value: 8 },
            fill: { field: "bg" },
            stroke: { field: "color" },
            strokeOpacity: { value: 0.18 }
          },
          update: {
            x: { field: "cardX" },
            y: { field: "cardY" },
            width: { field: "cardW" },
            height: { field: "cardH" },
            opacity: { signal: "width < 340 ? 0 : 0.96" }
          }
        }
      },
      {
        type: "symbol",
        from: { data: "eventCallouts" },
        encode: {
          enter: {
            shape: { value: "circle" },
            size: { value: 650 },
            fill: { value: "#ffffff" },
            fillOpacity: { value: 0.68 },
            stroke: { field: "color" },
            strokeOpacity: { value: 0.18 }
          },
          update: {
            x: { signal: "datum.cardX + 24" },
            y: { signal: "datum.cardY + 24" },
            opacity: { signal: "width < 340 ? 0 : 1" }
          }
        }
      },
      {
        type: "text",
        from: { data: "eventCallouts" },
        encode: {
          enter: {
            text: { field: "icon" },
            fontSize: { value: 18 },
            align: { value: "center" },
            baseline: { value: "middle" },
            fill: { field: "color" }
          },
          update: {
            x: { signal: "datum.cardX + 24" },
            y: { signal: "datum.cardY + 24" },
            opacity: { signal: "width < 340 ? 0 : 1" }
          }
        }
      },
      {
        type: "text",
        from: { data: "eventCallouts" },
        encode: {
          enter: {
            text: { field: "title" },
            font: { value: "Inter" },
            fontSize: { value: 9.4 },
            fontWeight: { value: 800 },
            lineBreak: { value: "\\n" },
            limit: { signal: "datum.cardW - 56" },
            align: { value: "left" },
            baseline: { value: "top" },
            fill: { field: "color" }
          },
          update: {
            x: { signal: "datum.cardX + 48" },
            y: { signal: "datum.cardY + 12" },
            opacity: { signal: "width < 340 ? 0 : 1" }
          }
        }
      },
      {
        type: "text",
        from: { data: "eventCallouts" },
        encode: {
          enter: {
            text: { field: "detail" },
            font: { value: "Inter" },
            fontSize: { value: 9.4 },
            lineBreak: { value: "\\n" },
            limit: { signal: "datum.cardW - 56" },
            align: { value: "left" },
            baseline: { value: "top" },
            fill: { value: colors.text }
          },
          update: {
            x: { signal: "datum.cardX + 48" },
            y: { signal: "datum.cardY + (datum.title === 'JUNE\\nSCHOOL HOLIDAY\\nSURGE' ? 48 : 42)" },
            opacity: { signal: "width < 340 ? 0 : 1" }
          }
        }
      },
      {
        type: "text",
        from: { data: "rings" },
        encode: {
          enter: {
            text: { field: "value" },
            font: { value: "Inter" },
            fontSize: { value: 13 },
            fill: { value: "#5b6d86" },
            align: { value: "center" },
            baseline: { value: "middle" }
          },
          update: {
            x: { field: "labelX" },
            y: { field: "labelY" }
          }
        }
      },
      {
        type: "text",
        encode: {
          enter: {
            x: { signal: "cx" },
            y: { signal: "cy" },
            text: { value: "Visitors\n(million)" },
            lineBreak: { value: "\n" },
            align: { value: "center" },
            baseline: { value: "middle" },
            font: { value: "Inter" },
            fontSize: { value: 13 },
            fontWeight: { value: 700 },
            fill: { value: colors.text }
          }
        }
      }
    ],
    config: {
      background: "#ffffff"
    }
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
    params: [
      {
        name: "SelectedIndicator",
        value: "Total Expenditure",
        bind: {
          input: "select",
          options: ["Total Expenditure", "Number of Visitors", "Number of Tourism Trips", "Average Expenditure per Trip"],
          name: "Highlight indicator: "
        }
      }
    ],
    transform: [
      {
        filter: "datum.Indicator == 'Total Expenditure' || datum.Indicator == 'Number of Visitors' || datum.Indicator == 'Number of Tourism Trips' || datum.Indicator == 'Average Expenditure per Trip'"
      },
      {
        calculate: "datum.Indicator == 'Total Expenditure' ? datum.Value / 83102.6097829999 * 100 : datum.Indicator == 'Number of Visitors' ? datum.Value / 205408.349313615 * 100 : datum.Indicator == 'Number of Tourism Trips' ? datum.Value / 276147.263 * 100 : datum.Value / 300.936454365051 * 100",
        as: "Index_2017"
      }
    ],
    layer: [
      {
        mark: { type: "line", point: { filled: true, size: 45 } },
        encoding: {
          x: { field: "Year", type: "ordinal", title: "Year", axis: { labelAngle: 45 } },
          y: { field: "Index_2017", type: "quantitative", title: "Index (2017 = 100)" },
          color: {
            field: "Indicator",
            type: "nominal",
            title: "Select indicator",
            scale: {
              domain: ["Total Expenditure", "Number of Visitors", "Number of Tourism Trips", "Average Expenditure per Trip"],
              range: ["#D9A441", "#2E6DA4", "#5A8CCF", "#2E8B57"]
            },
            legend: { orient: "bottom", direction: "horizontal", columns: 2 }
          },
          opacity: {
            condition: { test: "datum.Indicator == SelectedIndicator", value: 1 },
            value: 0.18
          },
          strokeWidth: {
            condition: { test: "datum.Indicator == SelectedIndicator", value: 4 },
            value: 1.8
          },
          tooltip: [
            { field: "Indicator", title: "Indicator" },
            { field: "Year", title: "Year" },
            { field: "Value", title: "Value", format: ",.1f" },
            { field: "Unit", title: "Unit" },
            { field: "Index_2017", title: "Index", format: ".1f" }
          ]
        }
      }
    ],
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
    applyFigureNarratives();

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
