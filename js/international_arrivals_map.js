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
    body: "Singapore remains Malaysia's largest source market by arrivals, contributing nearly half of total inbound visitors in 2024."
  },
  "receipts-scatter-chart": {
    number: "FIGURE 04",
    title: "Singapore and China deliver the largest receipt value",
    body: "Total tourism receipts show market value directly. Singapore leads by a wide margin, while China generates the second-largest RM value in 2024."
  },
  "arrivals-map": {
    number: "FIGURE 05",
    title: "Foreign hotel guests concentrate in gateway states",
    body: "The state map separates Peninsular Malaysia and Borneo so high-volume inbound destinations remain legible."
  },
  "domestic-state-visitors-chart": {
    number: "FIGURE 06",
    title: "Domestic tourism remains concentrated in key states",
    body: "Selangor and Kuala Lumpur continue to dominate domestic tourism activity, while nature-based destinations such as Sabah and Pahang remain highly attractive among Malaysian travelers."
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
      ${chartId === "source-markets-chart" ? `
        <div class="source-market-kpis" aria-label="Source market highlights">
          <div class="source-market-kpi">
            <span class="source-market-kpi-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" focusable="false">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </span>
            <div>
              <strong>18.9<small>M</small></strong>
              <span>arrivals from Singapore</span>
              <small>49.7% of total arrivals in 2024</small>
            </div>
          </div>
        </div>
      ` : ""}
      ${chartId === "domestic-state-visitors-chart" ? `
        <div class="domestic-share-card" aria-label="Top 5 domestic visits share">
          <span class="domestic-share-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" focusable="false">
              <path d="M16 21v-2a4 4 0 0 0-8 0v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
              <path d="M6 21v-2a4 4 0 0 1 2.2-3.58"></path>
              <path d="M18 21v-2a4 4 0 0 0-2.2-3.58"></path>
            </svg>
          </span>
          <div>
            <strong>61.5%</strong>
            <span>of domestic visits came from the top 5 states in 2024</span>
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
  const width = chartWidth("#source-markets-chart", 1040, 760);
  const isMobile = window.innerWidth < 760;
  const rankWidth = isMobile ? 36 : 50;
  const countryWidth = isMobile ? 218 : 260;
  const barWidth = Math.max(isMobile ? 280 : 660, Math.floor((width - rankWidth - countryWidth - 26) * 1.08));
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
  const rowScale = { paddingInner: 0.46, paddingOuter: 0.18 };
  const chartHeight = 470;

  return {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    data: { url: "data/top_source_markets_2024.csv" },
    transform: [
      { calculate: "toNumber(datum.Rank)", as: "Rank_Number" },
      { filter: "datum.Rank_Number <= 10" },
      { calculate: "datum.Arrivals_2024 / 1000000", as: "Arrivals_Million" },
      { calculate: "format(datum.Arrivals_Million, '.1f')", as: "Arrivals_Label" }
    ],
    title: {
      text: "TOP 10 SOURCE MARKETS BY ARRIVALS IN 2024",
      subtitle: "(million)",
      anchor: "start",
      font: "Inter",
      fontSize: 20,
      fontWeight: 900,
      color: "#07175f",
      subtitleFont: "Inter",
      subtitleFontSize: 15,
      subtitleFontWeight: 700,
      subtitleColor: "#3d4966",
      offset: 14
    },
    hconcat: [
      {
        width: rankWidth,
        height: chartHeight,
        layer: [
          {
            mark: { type: "point", filled: true, size: 760, opacity: 1 },
            encoding: {
              x: { value: 20 },
              y: { field: "Country", type: "nominal", sort: countrySort, axis: null, scale: rowScale },
              color: {
                condition: { test: "datum.Rank_Number == 1", value: "#0B2A6F" },
                value: "#e6edf8"
              }
            }
          },
          {
            mark: { type: "text", align: "center", baseline: "middle", fontSize: 13, fontWeight: 900 },
            encoding: {
              x: { value: 20 },
              y: { field: "Country", type: "nominal", sort: countrySort, axis: null, scale: rowScale },
              text: { field: "Rank_Number", type: "quantitative" },
              color: {
                condition: { test: "datum.Rank_Number == 1", value: "#ffffff" },
                value: "#0B2A6F"
              }
            }
          }
        ]
      },
      {
        width: countryWidth,
        height: chartHeight,
        layer: [
          {
            mark: { type: "image", width: 34, height: 22, align: "center", baseline: "middle" },
            encoding: {
              x: { value: 20 },
              y: { field: "Country", type: "nominal", sort: countrySort, axis: null, scale: rowScale },
              url: { field: "Flag_Path", type: "nominal" }
            }
          },
          {
            mark: { type: "text", align: "left", baseline: "middle", fontSize: 15, fontWeight: 900, color: "#0B2A6F" },
            encoding: {
              x: { value: 66 },
              y: { field: "Country", type: "nominal", sort: countrySort, axis: null, scale: rowScale },
              text: { field: "Flag", type: "nominal" }
            }
          },
          {
            mark: { type: "text", align: "left", baseline: "middle", fontSize: 16, fontWeight: 800, color: "#101a36" },
            encoding: {
              x: { value: 118 },
              y: { field: "Country", type: "nominal", sort: countrySort, axis: null, scale: rowScale },
              text: { field: "Country", type: "nominal" },
              tooltip: [
                { field: "Country", title: "Country" },
                { field: "Arrivals_2024", title: "Arrivals", format: "," }
              ]
            }
          }
        ]
      },
      {
        width: barWidth,
        height: chartHeight,
        layer: [
          {
            transform: [{ filter: "datum.Rank_Number != 1" }],
            mark: { type: "bar", size: 24, cornerRadiusEnd: 5 },
            encoding: {
              y: { field: "Country", type: "nominal", sort: countrySort, axis: null, scale: rowScale },
              x: {
                field: "Arrivals_Million",
                type: "quantitative",
                title: "Arrivals (million)",
                scale: { domain: [0, 20] },
                axis: {
                  orient: "bottom",
                  grid: true,
                  gridDash: [5, 5],
                  gridColor: "rgba(120,150,190,0.18)",
                  domainColor: "#0B2A6F",
                  tickColor: "#0B2A6F",
                  labelColor: "#0B2A6F",
                  labelFontWeight: 800,
                  titleColor: "#3d4966",
                  titleFontWeight: 800,
                  values: [0, 5, 10, 15, 20]
                }
              },
              color: { value: "#C7D5F0" },
              tooltip: [
                { field: "Country", title: "Country" },
                { field: "Arrivals_2024", title: "Arrivals", format: "," }
              ]
            }
          },
          {
            transform: [{ filter: "datum.Rank_Number == 1" }],
            mark: { type: "bar", size: 34, cornerRadiusEnd: 6 },
            encoding: {
              y: { field: "Country", type: "nominal", sort: countrySort, axis: null, scale: rowScale },
              x: { field: "Arrivals_Million", type: "quantitative", scale: { domain: [0, 20] } },
              color: { value: "#0B2A6F" },
              tooltip: [
                { field: "Country", title: "Country" },
                { field: "Arrivals_2024", title: "Arrivals", format: "," }
              ]
            }
          },
          {
            transform: [{ filter: "datum.Rank_Number != 1" }],
            mark: { type: "text", align: "left", dx: 10, baseline: "middle", fontWeight: 800, fontSize: 16, color: "#101a36" },
            encoding: {
              y: { field: "Country", type: "nominal", sort: countrySort, axis: null, scale: rowScale },
              x: { field: "Arrivals_Million", type: "quantitative", scale: { domain: [0, 20] } },
              text: { field: "Arrivals_Label", type: "nominal" }
            }
          },
          {
            transform: [{ filter: "datum.Rank_Number == 1" }],
            mark: { type: "text", align: "left", dx: 12, baseline: "middle", fontWeight: 900, fontSize: 22, color: "#0B2A6F" },
            encoding: {
              y: { field: "Country", type: "nominal", sort: countrySort, axis: null, scale: rowScale },
              x: { field: "Arrivals_Million", type: "quantitative", scale: { domain: [0, 20] } },
              text: { field: "Arrivals_Label", type: "nominal" }
            }
          }
        ]
      }
    ],
    spacing: 4,
    resolve: { scale: { color: "independent" } },
    config: baseConfig()
  };
}

function monthlyTrendSpec() {
  const availableWidth = chartWidth("#monthly-trend-chart", 760, 650);
  const isMobile = window.innerWidth < 760;
  const size = isMobile
    ? Math.min(Math.max(250, availableWidth - 78), 300)
    : Math.min(Math.max(390, availableWidth - 300), 500);
  const calloutRail = isMobile ? 0 : 224;
  const width = size + calloutRail;
  const height = size + (isMobile ? 190 : 68);
  return {
    $schema: "https://vega.github.io/schema/vega/v5.json",
    width,
    height,
    padding: { top: 18, right: isMobile ? 18 : 28, bottom: 12, left: isMobile ? 18 : 28 },
    signals: [
      { name: "plotSize", value: size },
      { name: "hasCalloutRail", value: !isMobile },
      { name: "cx", update: "plotSize / 2 + (hasCalloutRail ? 8 : 0)" },
      { name: "cy", update: "plotSize / 2 + (plotSize < 340 ? 34 : 42)" },
      { name: "innerRadius", value: 10 },
      { name: "outerRadius", update: "plotSize * (plotSize < 340 ? 0.31 : 0.34)" },
      { name: "legendCardWidth", update: "plotSize < 340 ? 190 : 134" },
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
          { type: "formula", as: "legendCenterX", expr: "plotSize < 340 ? width / 2 : width * datum.legendX" },
          { type: "formula", as: "legendY", expr: "plotSize < 340 ? height - 112 + datum.legendRow * 38 : height - 26" }
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
            title: "DECEMBER\\nPEAK",
            detail: "Highest: 3.8M",
            anchor: "topLeft"
          },
          {
            Month_Num: 6,
            value: 3.40929,
            color: "#E85D04",
            bg: "#FDE9DC",
            icon: "🚌",
            title: "JUNE\\nSCHOOL HOLIDAY\\nSURGE",
            detail: "Holiday travel\\nboosted arrivals",
            anchor: "rightBottom"
          }
        ],
        transform: [
          { type: "formula", as: "angle", expr: "(datum.Month_Num - 1) / 12 * 2 * PI - PI / 2" },
          { type: "formula", as: "r", expr: "innerRadius + datum.value / maxVisitors * (outerRadius - innerRadius)" },
          { type: "formula", as: "x", expr: "cx + datum.r * cos(datum.angle)" },
          { type: "formula", as: "y", expr: "cy + datum.r * sin(datum.angle)" },
          { type: "formula", as: "cardW", expr: "datum.anchor === 'topLeft' ? 146 : 190" },
          { type: "formula", as: "cardH", expr: "datum.anchor === 'topLeft' ? 58 : 80" },
          { type: "formula", as: "cardX", expr: "datum.anchor === 'topLeft' ? 2 : width - datum.cardW - 2" },
          { type: "formula", as: "cardY", expr: "datum.anchor === 'topLeft' ? 4 : (datum.anchor === 'rightMiddle' ? cy + 46 : cy + 136)" },
          { type: "formula", as: "leaderX", expr: "datum.anchor === 'topLeft' ? datum.cardX + datum.cardW - 8 : datum.cardX + 2" },
          { type: "formula", as: "leaderY", expr: "datum.anchor === 'rightMiddle' ? datum.cardY + datum.cardH - 12 : datum.cardY + datum.cardH / 2" }
        ]
      },
      {
        name: "eventHighlights",
        values: [
          { Month_Num: 12, value: 3.805306, color: "#2E8B57" },
          { Month_Num: 8, value: 3.662108, color: "#F4A000" },
          { Month_Num: 6, value: 3.40929, color: "#E85D04" }
        ],
        transform: [
          { type: "formula", as: "angle", expr: "(datum.Month_Num - 1) / 12 * 2 * PI - PI / 2" },
          { type: "formula", as: "r", expr: "innerRadius + datum.value / maxVisitors * (outerRadius - innerRadius)" },
          { type: "formula", as: "x", expr: "cx + datum.r * cos(datum.angle)" },
          { type: "formula", as: "y", expr: "cy + datum.r * sin(datum.angle)" }
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
        from: { data: "eventHighlights" },
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
        from: { data: "eventHighlights" },
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
        type: "rule",
        from: { data: "eventCallouts" },
        encode: {
          enter: {
            stroke: { field: "color" },
            strokeWidth: { value: 1.4 },
            strokeOpacity: { value: 0.58 }
          },
          update: {
            x: { field: "leaderX" },
            y: { field: "leaderY" },
            x2: { field: "x" },
            y2: { field: "y" },
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
            fontSize: { value: 9.2 },
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
            fontSize: { value: 9.2 },
            lineBreak: { value: "\\n" },
            limit: { signal: "datum.cardW - 56" },
            align: { value: "left" },
            baseline: { value: "top" },
            fill: { value: colors.text }
          },
          update: {
            x: { signal: "datum.cardX + 48" },
            y: { signal: "datum.cardY + (datum.title === 'JUNE\\nSCHOOL HOLIDAY\\nSURGE' ? 62 : 44)" },
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
    height: 360,
    title: {
      text: "Visitor Expenditure Mix",
      subtitle: "Share of 2024 international visitor expenditure",
      fontSize: 24,
      subtitleFontSize: 14
    },
    data: { url: "data/visitor_expenditure_items_2024_2023.csv" },
    transform: [
      { calculate: "datum.Value_2024_RM_Mil / 1000", as: "Value_2024_RM_Bil" },
      { filter: "datum.Share_2024 >= 1" },
      { calculate: "datum.Item + '  ' + format(datum.Share_2024, '.1f') + '%'", as: "Share_Label" }
    ],
    layer: [
      {
        mark: { type: "arc", innerRadius: 78, outerRadius: 148, stroke: "#ffffff", strokeWidth: 2 },
        encoding: {
          theta: { field: "Share_2024", type: "quantitative", stack: true },
          color: {
            field: "Item",
            type: "nominal",
            scale: {
              domain: ["Shopping", "Accommodation", "Food & Beverages", "International Airfares", "Local Transportation", "Medical", "Organised Tour", "Domestic Airfares", "Entertainment", "Fuel"],
              range: ["#D9A441", "#0B2A6F", "#5A8CCF", "#8FB6D9", "#9BC5BF", "#7BAE7F", "#C7D5F0", "#B8C4D8", "#D9B06F", "#E2D7B5"]
            },
            legend: { orient: "right", title: null, labelLimit: 180 }
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
        transform: [{ filter: "datum.Item == 'Shopping'" }],
        mark: { type: "text", align: "center", baseline: "middle", fontSize: 28, fontWeight: 900, color: "#0B2A6F" },
        encoding: {
          text: { value: "37.4%" }
        }
      },
      {
        transform: [{ filter: "datum.Item == 'Shopping'" }],
        mark: { type: "text", align: "center", baseline: "middle", dy: 28, fontSize: 13, fontWeight: 800, color: "#5b6d86" },
        encoding: {
          text: { value: "shopping share" }
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

const domesticStateRankings = [
  {
    rank: 1,
    state: "Selangor",
    destination: "Batu Caves",
    visitors: 34.5,
    image: "assets/figure06-selangor-batu-caves.png",
    accent: "#1A55D6"
  },
  {
    rank: 2,
    state: "W.P. Kuala Lumpur",
    destination: "Petronas Twin Towers",
    visitors: 27.0,
    image: "assets/figure06-kuala-lumpur-petronas.png",
    accent: "#0F7F97"
  },
  {
    rank: 3,
    state: "Perak",
    destination: "Ipoh Limestone Hills",
    visitors: 21.8,
    image: "assets/figure06-perak-ipoh-limestone.png",
    accent: "#2E9B9B"
  },
  {
    rank: 4,
    state: "Sabah",
    destination: "Semporna",
    visitors: 20.6,
    image: "assets/figure06-sabah-semporna.png",
    accent: "#7B67B4"
  },
  {
    rank: 5,
    state: "Pahang",
    destination: "Cameron Highlands",
    visitors: 20.2,
    image: "assets/figure06-pahang-cameron-highlands.png",
    accent: "#E86F22"
  }
];

function renderDomesticStateVisitorsRanking() {
  const chart = document.querySelector("#domestic-state-visitors-chart");
  if (!chart) return;

  const maxVisitors = Math.max(...domesticStateRankings.map((row) => row.visitors));
  const rows = domesticStateRankings.map((row) => {
    const width = ((row.visitors / maxVisitors) * 100).toFixed(1);
    return `
      <article class="domestic-ranking-row" style="--rank-color: ${row.accent}; --bar-width: ${width}%;">
        <div class="domestic-rank-number">${row.rank}</div>
        <div class="domestic-rank-copy">
          <strong>${row.state}</strong>
          <span>${row.destination}</span>
        </div>
        <div class="domestic-photo-track">
          <div class="domestic-photo-bar" role="img" aria-label="${row.state}, ${row.destination}: ${row.visitors.toFixed(1)} million domestic visitors" style="background-image: url('${row.image}');">
            <div class="domestic-photo-value">
              <strong>${row.visitors.toFixed(1)}<small>M</small></strong>
              <span>visitors</span>
            </div>
          </div>
        </div>
      </article>
    `;
  }).join("");

  chart.innerHTML = `
    <section class="domestic-photo-ranking" aria-label="Top 5 domestic tourism states in 2024">
      <header class="domestic-ranking-header">
        <h3>TOP 5 DOMESTIC TOURISM STATES IN 2024</h3>
        <p>By number of domestic visitors (million)</p>
      </header>
      <div class="domestic-ranking-list">
        ${rows}
      </div>
    </section>
  `;
}

function domesticExpenditureSpec() {
  return {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    width: chartWidth("#domestic-expenditure-chart", 760, 650),
    height: 340,
    title: {
      text: "Domestic Visitor Expenditure Mix",
      subtitle: "Bubble size shows 2024 expenditure value",
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
        mark: { type: "circle", opacity: 0.82, stroke: "#ffffff", strokeWidth: 2 },
        encoding: {
          x: { field: "Share_Pct", type: "quantitative", title: "Share of domestic expenditure (%)", scale: { domain: [0, 42] }, axis: { grid: true, gridColor: "rgba(120,150,190,0.16)" } },
          y: { field: "Component", type: "nominal", sort: "-x", title: null, axis: { labelFontSize: 13, labelFontWeight: 750 } },
          size: { field: "Expenditure_RM_Bil", type: "quantitative", title: "RM billion", scale: { range: [260, 4400] }, legend: { orient: "bottom", direction: "horizontal" } },
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
        mark: { type: "text", align: "center", baseline: "middle", fontWeight: 900, color: "#152238", fontSize: 12 },
        encoding: {
          x: { field: "Share_Pct", type: "quantitative", scale: { domain: [0, 42] } },
          y: { field: "Component", type: "nominal", sort: "-x" },
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
    height: 330,
    title: {
      text: "Purpose of Domestic Trips",
      subtitle: "Bubble grid; circle size represents share of trips in 2024",
      fontSize: 24,
      subtitleFontSize: 14
    },
    data: { url: "data/domestic_trip_purpose_2024.csv" },
    transform: [
      { window: [{ op: "rank", as: "Rank" }], sort: [{ field: "Share_Pct", order: "descending" }] },
      { calculate: "(datum.Rank - 1) % 4", as: "Grid_X" },
      { calculate: "floor((datum.Rank - 1) / 4)", as: "Grid_Y" },
      { calculate: "datum.Share_Pct + '%'", as: "Share_Label" }
    ],
    layer: [
      {
        mark: { type: "circle", opacity: 0.86, stroke: "#ffffff", strokeWidth: 2 },
        encoding: {
          x: { field: "Grid_X", type: "ordinal", title: null, axis: null },
          y: { field: "Grid_Y", type: "ordinal", title: null, axis: null, sort: "ascending" },
          size: { field: "Share_Pct", type: "quantitative", legend: null, scale: { range: [450, 8200] } },
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
        mark: { type: "text", align: "center", baseline: "middle", dy: -5, fontSize: 16, fontWeight: 900, color: "#152238" },
        encoding: {
          x: { field: "Grid_X", type: "ordinal" },
          y: { field: "Grid_Y", type: "ordinal", sort: "ascending" },
          text: { field: "Share_Label" }
        }
      },
      {
        mark: { type: "text", align: "center", baseline: "top", dy: 16, fontSize: 12, fontWeight: 800, color: "#34445c", limit: 145 },
        encoding: {
          x: { field: "Grid_X", type: "ordinal" },
          y: { field: "Grid_Y", type: "ordinal", sort: "ascending" },
          text: { field: "Purpose" }
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
            mark: { type: "arc", innerRadius: 62, outerRadius: 118, stroke: "#ffffff", strokeWidth: 2 },
            encoding: {
              theta: { field: "Share_Pct", type: "quantitative", stack: true },
              color: {
                field: "Mode",
                type: "nominal",
                scale: { domain: ["Land", "Air", "Water"], range: ["#2E8B57", "#2E6DA4", "#5A8CCF"] },
                legend: { orient: "bottom", title: null }
              },
              tooltip: [
                { field: "Mode", title: "Mode" },
                { field: "Share_Pct", title: "Share %", format: ".1f" }
              ]
            }
          },
          {
            transform: [{ filter: "datum.Mode == 'Land'" }],
            mark: { type: "text", align: "center", baseline: "middle", fontSize: 28, fontWeight: 900, color: "#2E8B57" },
            encoding: {
              text: { field: "Share_Pct", type: "quantitative", format: ".1f" }
            }
          },
          {
            transform: [{ filter: "datum.Mode == 'Land'" }],
            mark: { type: "text", align: "center", baseline: "middle", dy: 28, fontSize: 12, fontWeight: 800, color: "#5b6d86" },
            encoding: {
              text: { value: "land" }
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
            mark: { type: "arc", innerRadius: 62, outerRadius: 118, stroke: "#ffffff", strokeWidth: 2 },
            encoding: {
              theta: { field: "Share_Pct", type: "quantitative", stack: true },
              color: {
                condition: [
                  { test: "datum.Accommodation_Type == \"Relatives' & Friends' House\"", value: "#D9A441" },
                  { test: "datum.Accommodation_Type == 'Hotel'", value: "#2E6DA4" }
                ],
                value: "#C7D5F0",
                legend: { orient: "bottom", title: null, labelLimit: 150 }
              },
              tooltip: [
                { field: "Accommodation_Type", title: "Type" },
                { field: "Share_Pct", title: "Share %", format: ".1f" }
              ]
            }
          },
          {
            transform: [{ filter: "datum.Accommodation_Type == \"Relatives' & Friends' House\"" }],
            mark: { type: "text", align: "center", baseline: "middle", fontSize: 28, fontWeight: 900, color: "#D9A441" },
            encoding: {
              text: { field: "Share_Pct", type: "quantitative", format: ".1f" }
            }
          },
          {
            transform: [{ filter: "datum.Accommodation_Type == \"Relatives' & Friends' House\"" }],
            mark: { type: "text", align: "center", baseline: "middle", dy: 28, fontSize: 12, fontWeight: 800, color: "#5b6d86" },
            encoding: {
              text: { value: "friends/family" }
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
  const width = chartWidth("#receipts-scatter-chart", 1180, 760);

  return {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    width,
    height: 430,
    padding: { left: 150, right: 90, top: 34, bottom: 44 },
    title: {
      text: "Top tourism receipt markets in 2024",
      subtitle: "Total receipts by source market, RM billion",
      fontSize: 25,
      subtitleFontSize: 15,
      anchor: "start",
      offset: 14
    },
    data: { url: "data/visitor_receipts_by_country_2024_2023.csv" },
    transform: [
      { calculate: "toNumber(datum.Rank)", as: "Receipt_Rank" },
      {
        lookup: "Country",
        from: {
          data: { url: "data/top_source_markets_2024.csv" },
          key: "Country",
          fields: ["Rank", "Flag"]
        }
      },
      { filter: "datum.Receipt_Rank <= 12" },
      { calculate: "isValid(datum.Rank) ? toNumber(datum.Rank) : null", as: "Arrival_Rank" },
      { calculate: "datum.Receipts_2024_RM_Mil / 1000", as: "Receipts_RM_Bil" },
      { calculate: "'RM' + format(datum.Receipts_RM_Bil, '.1f') + 'B'", as: "Receipt_Label" },
      { calculate: "isValid(datum.Flag) ? datum.Flag + '  ' + datum.Country : datum.Country", as: "Market_Label" },
      { calculate: "isValid(datum.Arrival_Rank) ? 'arrival rank #' + datum.Arrival_Rank : 'not in top arrivals'", as: "Arrival_Label" }
    ],
    layer: [
      {
        mark: { type: "bar", cornerRadiusEnd: 6, height: { band: 0.62 } },
        encoding: {
          x: {
            field: "Receipts_RM_Bil",
            type: "quantitative",
            title: "Total tourism receipts (RM billion)",
            scale: { domain: [0, 30] },
            axis: {
              values: [0, 5, 10, 15, 20, 25, 30],
              grid: true,
              gridColor: "rgba(120,150,190,0.18)",
              domain: false,
              tickColor: "#ccd8e6"
            }
          },
          y: {
            field: "Market_Label",
            type: "nominal",
            sort: { field: "Receipt_Rank", order: "ascending" },
            title: null,
            axis: {
              labelFontSize: 15,
              labelFontWeight: 800,
              labelColor: "#152238",
              domain: false,
              ticks: false
            }
          },
          color: {
            condition: [
              { test: "datum.Country === 'Singapore'", value: "#0B2A6F" },
              { test: "datum.Country === 'China'", value: "#1A36D6" }
            ],
            value: "#C7D5F0"
          },
          tooltip: [
            { field: "Country", title: "Country" },
            { field: "Receipt_Rank", title: "2024 total receipts rank" },
            { field: "Arrival_Rank", title: "2024 arrivals rank" },
            { field: "Receipts_RM_Bil", title: "Receipts (RM bil.)", format: ".1f" }
          ]
        }
      },
      {
        mark: { type: "text", align: "left", baseline: "middle", dx: 10, fontSize: 14, fontWeight: 900, color: "#152238" },
        encoding: {
          x: { field: "Receipts_RM_Bil", type: "quantitative", scale: { domain: [0, 30] } },
          y: { field: "Market_Label", type: "nominal", sort: { field: "Receipt_Rank", order: "ascending" } },
          text: { field: "Receipt_Label" }
        }
      },
      {
        transform: [{ filter: "datum.Country === 'Singapore' || datum.Country === 'China'" }],
        mark: { type: "text", align: "left", baseline: "middle", dx: 72, fontSize: 12.5, fontWeight: 800, color: "#5b6d86" },
        encoding: {
          x: { field: "Receipts_RM_Bil", type: "quantitative", scale: { domain: [0, 30] } },
          y: { field: "Market_Label", type: "nominal", sort: { field: "Receipt_Rank", order: "ascending" } },
          text: { field: "Arrival_Label", type: "nominal" },
          opacity: { value: 0.9 }
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
    renderDomesticStateVisitorsRanking();

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
