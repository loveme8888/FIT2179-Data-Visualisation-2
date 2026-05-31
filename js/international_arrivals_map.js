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
  "state-guests-chart": {
    number: "FIGURE 07",
    title: "Growth opportunities appear beyond the largest bases",
    body: "State growth rates identify where foreign hotel guest momentum strengthened most sharply year on year."
  },
  "expenditure-chart": {
    number: "FIGURE 08",
    title: "Shopping is the largest international visitor spend category",
    body: "International visitors spent the most on shopping, making up more than one-third of total expenditure in 2024, followed by accommodation and food & beverages."
  },
  "domestic-purpose-chart": {
    number: "FIGURE 09",
    title: "Domestic trips are mostly social and shopping-led",
    body: "Visiting relatives and friends is the largest trip purpose, followed by shopping and holiday or leisure travel."
  },
  "domestic-od-chart": {
    number: "FIGURE 10",
    title: "Origin-destination flows reveal state-to-state travel corridors",
    body: "The heatmap shows where domestic tourists came from and which destination states they visited in 2024."
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
      ${chartId === "expenditure-chart" ? `
        <div class="expenditure-insight-card" aria-label="Shopping expenditure insight">
          <span class="expenditure-insight-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" focusable="false">
              <path d="M6 8h12l-1 12H7L6 8Z"></path>
              <path d="M9 8V6a3 3 0 0 1 6 0v2"></path>
              <path d="M9 13h.01"></path>
              <path d="M15 13h.01"></path>
            </svg>
          </span>
          <div>
            <strong>37.4%</strong>
            <span>of total spend was contributed by shopping in 2024.</span>
          </div>
          <p class="expenditure-insight-note">
            <i aria-hidden="true">
              <svg viewBox="0 0 24 24" focusable="false">
                <path d="M12 2l2.9 6.5 7.1.7-5.3 4.8 1.5 7-6.2-3.6L5.8 21l1.5-7L2 9.2l7.1-.7L12 2Z"></path>
              </svg>
            </i>
            <span>Shopping alone accounts for over one-third of international visitor expenditure.</span>
          </p>
        </div>
      ` : ""}
      ${chartId === "domestic-purpose-chart" ? `
        <div class="purpose-legend-card" aria-label="Domestic trip purpose ranking">
          <div class="purpose-legend-row" style="--purpose-color:#F05A7A"><span>1</span><b>Visiting relatives & friends</b><strong>34.6%</strong></div>
          <div class="purpose-legend-row" style="--purpose-color:#F26B2A"><span>2</span><b>Shopping</b><strong>27.6%</strong></div>
          <div class="purpose-legend-row" style="--purpose-color:#F2B705"><span>3</span><b>Holiday / Leisure</b><strong>14.6%</strong></div>
          <div class="purpose-legend-row" style="--purpose-color:#A8C51F"><span>4</span><b>Incentive travel</b><strong>10.7%</strong></div>
          <div class="purpose-legend-row" style="--purpose-color:#48B86E"><span>5</span><b>Entertainment</b><strong>5.7%</strong></div>
          <div class="purpose-legend-row" style="--purpose-color:#3BB8AE"><span>6</span><b>Medical / Wellness</b><strong>4.5%</strong></div>
          <div class="purpose-legend-row" style="--purpose-color:#9B75C4"><span>7</span><b>Others</b><strong>3.8%</strong></div>
          <div class="purpose-legend-row" style="--purpose-color:#6FA8DC"><span>8</span><b>Religious visit</b><strong>1.5%</strong></div>
          <div class="purpose-legend-row" style="--purpose-color:#7A61C9"><span>9</span><b>Business</b><strong>0.8%</strong></div>
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
      anchor: "start",
      fontSize: 24,
      fontWeight: 400,
      subtitleFontSize: 15,
      subtitleFontWeight: 600,
      offset: 10
    },
    axis: {
      labelFont: "Inter",
      titleFont: "Inter",
      labelFontSize: 12,
      titleFontSize: 12,
      labelFontWeight: 700,
      titleFontWeight: 700,
      labelColor: "#34445c",
      titleColor: "#34445c",
      gridColor: "#e7eef5",
      domainColor: "#c8d8e7",
      tickColor: "#c8d8e7"
    },
    legend: {
      labelFont: "Inter",
      titleFont: "Inter",
      labelFontSize: 12,
      titleFontSize: 12,
      labelFontWeight: 700,
      titleFontWeight: 800,
      labelColor: "#34445c",
      titleColor: "#34445c"
    },
    view: {
      stroke: null
    }
  };
}

function mapSpec() {
  const width = chartWidth("#arrivals-map", 820, 680);
  const height = 540;

  return {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    width,
    height,
    projection: {
      type: "mercator",
      center: [109.2, 4.1],
      scale: Math.min(1760, Math.max(1240, width * 1.65)),
      translate: [width / 2, height / 2 - 6]
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
          { calculate: "toNumber(datum.Foreigner_2024)", as: "Foreigner_2024_Number" },
          { calculate: "toNumber(datum.Foreigner_2024_Million)", as: "Foreigner_2024_Million_Number" }
        ],
        mark: { type: "geoshape", stroke: "#ffffff", strokeWidth: 1.2 },
        encoding: {
          color: {
            field: "Foreigner_2024_Million_Number",
            type: "quantitative",
            title: "Foreign Hotel Guests, 2024",
            scale: { scheme: "blues", domain: [0, 12.2] },
            legend: {
              orient: "bottom",
              direction: "horizontal",
              gradientLength: Math.min(420, width - 80),
              gradientThickness: 13,
              format: ".1f"
            }
          },
          tooltip: [
            { field: "Display_State", title: "State" },
            { field: "Foreigner_2024_Million_Number", title: "Hotel guests (M)", format: ".1f" }
          ]
        }
      },
      labelLayer(null, true),
      labelLayer(null, false)
    ],
    config: baseConfig()
  };
}

function labelLayer(region, halo) {
  return {
    data: { url: "data/foreign_hotel_guests_by_state_2024.csv" },
    transform: [
      { filter: region ? `datum.Region == '${region}' && datum.Show_Label == 'true'` : "datum.Show_Label == 'true'" },
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
      fontSize: 9.5,
      fontWeight: "bold",
      lineBreak: "\n",
      lineHeight: 11.5,
      color: colors.text,
      stroke: halo ? "#ffffff" : null,
      strokeWidth: halo ? 2.3 : 0
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
  const plotSize = isMobile
    ? Math.min(Math.max(300, availableWidth - 32), 380)
    : Math.min(Math.max(520, availableWidth - 170), 640);
  const width = isMobile ? plotSize : Math.min(availableWidth, plotSize + 150);
  const height = isMobile ? plotSize + 175 : plotSize + 52;
  const cx = isMobile ? width / 2 : width / 2;
  const cy = isMobile ? plotSize / 2 + 58 : plotSize / 2 + 32;
  const innerRadius = 14;
  const outerRadius = plotSize * 0.34;
  const labelRadius = outerRadius + 48;
  const xDomain = [0, width];
  const yDomain = [height, 0];
  const sharedPosition = {
    x: { field: "x", type: "quantitative", scale: { domain: xDomain }, axis: null },
    y: { field: "y", type: "quantitative", scale: { domain: yDomain }, axis: null }
  };
  const monthlyTransforms = [
    { calculate: "toNumber(datum.Month_Num)", as: "Month_Order" },
    { calculate: "['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][datum.Month_Order - 1]", as: "Month_Abbr" },
    { calculate: `(datum.Month_Order - 1) / 12 * 2 * PI - PI / 2`, as: "angle" },
    { calculate: `${cx} + ${labelRadius} * cos(datum.angle)`, as: "labelX" },
    { calculate: `${cy} + ${labelRadius} * sin(datum.angle)`, as: "labelY" },
    { calculate: `${cx} + (${labelRadius} + 34) * cos(datum.angle)`, as: "valueX" },
    { calculate: `${cy} + (${labelRadius} + 34) * sin(datum.angle)`, as: "valueY" },
    { calculate: "datum.Visitors_2024 / 1000000", as: "Visitors_2024_Million" },
    { calculate: "format(datum.Visitors_2024_Million, '.1f') + 'M'", as: "Visitors_2024_Label" },
    { calculate: "abs(cos(datum.angle)) < 0.15 ? 'center' : cos(datum.angle) > 0 ? 'left' : 'right'", as: "labelAlign" },
    { calculate: "abs(sin(datum.angle)) < 0.15 ? 'middle' : sin(datum.angle) > 0 ? 'top' : 'bottom'", as: "labelBaseline" }
  ];
  const visitorTransforms = [
    ...monthlyTransforms,
    { fold: ["Visitors_2023", "Visitors_2024"], as: ["Year_Field", "Visitors"] },
    { calculate: "datum.Year_Field === 'Visitors_2024' ? '2024' : '2023'", as: "Year_Label" },
    { calculate: "datum.Visitors / 1000000", as: "Visitors_Million" },
    { calculate: `${innerRadius} + min(datum.Visitors_Million, 4) / 4 * (${outerRadius} - ${innerRadius})`, as: "r" },
    { calculate: `${cx} + datum.r * cos(datum.angle)`, as: "x" },
    { calculate: `${cy} + datum.r * sin(datum.angle)`, as: "y" },
    { calculate: "format(datum.Visitors_Million, '.2f') + 'M'", as: "Tooltip_Visitors" }
  ];

  return {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    width,
    height,
    padding: { top: 12, right: isMobile ? 18 : 28, bottom: 18, left: isMobile ? 18 : 28 },
    data: {
      url: "data/foreign_visitors_monthly_2024_2023.csv",
      format: { type: "csv" }
    },
    layer: [
      {
        data: { values: [1, 2, 3, 4].map((value) => ({ value })) },
        transform: [
          { calculate: `${innerRadius} + datum.value / 4 * (${outerRadius} - ${innerRadius})`, as: "r" },
          { calculate: `${cx}`, as: "x" },
          { calculate: `${cy}`, as: "y" },
          { calculate: "pow(datum.r * 2, 2)", as: "ringSize" },
          { calculate: `datum.value === 4 ? ${cx} + 8 : ${cx} + 8`, as: "labelX" },
          { calculate: `${cy} - datum.r + 4`, as: "labelY" }
        ],
        mark: { type: "point", filled: false, stroke: "#dbe6f2", strokeWidth: 1.4 },
        encoding: {
          x: { field: "x", type: "quantitative", scale: { domain: xDomain }, axis: null },
          y: { field: "y", type: "quantitative", scale: { domain: yDomain }, axis: null },
          size: { field: "ringSize", type: "quantitative", scale: null },
          tooltip: null
        }
      },
      {
        transform: [
          ...monthlyTransforms,
          { calculate: `${cx} + 8 * cos(datum.angle)`, as: "x" },
          { calculate: `${cy} + 8 * sin(datum.angle)`, as: "y" },
          { calculate: `${cx} + ${outerRadius} * cos(datum.angle)`, as: "x2" },
          { calculate: `${cy} + ${outerRadius} * sin(datum.angle)`, as: "y2" }
        ],
        mark: { type: "rule", color: "#e8f0f8", strokeWidth: 1.2 },
        encoding: {
          ...sharedPosition,
          x2: { field: "x2" },
          y2: { field: "y2" },
          tooltip: null
        }
      },
      {
        transform: visitorTransforms,
        mark: { type: "line", interpolate: "linear-closed", strokeWidth: 4, strokeJoin: "round", opacity: 0.9 },
        encoding: {
          ...sharedPosition,
          detail: { field: "Year_Label" },
          order: { field: "Month_Order", type: "quantitative" },
          color: {
            field: "Year_Label",
            title: null,
            scale: { domain: ["2023", "2024"], range: ["#c7d3e1", "#E85D04"] },
            legend: { orient: "top", direction: "horizontal", labelFontSize: 18, labelFontWeight: 800, symbolType: "stroke", symbolStrokeWidth: 4 }
          },
          opacity: { condition: { test: "datum.Year_Label === '2024'", value: 1 }, value: 0.9 },
          tooltip: [
            { field: "Month", title: "Month" },
            { field: "Year_Label", title: "Year" },
            { field: "Visitors", title: "Visitors", format: ",.0f" },
            { field: "Tooltip_Visitors", title: "Visitors (million)" }
          ]
        }
      },
      {
        transform: visitorTransforms,
        mark: { type: "point", filled: true, size: 130, stroke: "#ffffff", strokeWidth: 1.8 },
        encoding: {
          ...sharedPosition,
          color: { field: "Year_Label", scale: { domain: ["2023", "2024"], range: ["#aab8c8", "#E85D04"] }, legend: null },
          tooltip: [
            { field: "Month", title: "Month" },
            { field: "Year_Label", title: "Year" },
            { field: "Visitors", title: "Visitors", format: ",.0f" }
          ]
        }
      },
      {
        transform: monthlyTransforms,
        mark: { type: "text", font: "Inter", fontSize: 18, fontWeight: 900, color: colors.text },
        encoding: {
          x: { field: "labelX", type: "quantitative", scale: { domain: xDomain }, axis: null },
          y: { field: "labelY", type: "quantitative", scale: { domain: yDomain }, axis: null },
          text: { field: "Month_Abbr" },
          align: { field: "labelAlign" },
          baseline: { field: "labelBaseline" },
          tooltip: null
        }
      },
      {
        transform: monthlyTransforms,
        mark: { type: "text", font: "Inter", fontSize: 14, fontWeight: 900, color: "#E85D04" },
        encoding: {
          x: { field: "valueX", type: "quantitative", scale: { domain: xDomain }, axis: null },
          y: { field: "valueY", type: "quantitative", scale: { domain: yDomain }, axis: null },
          text: { field: "Visitors_2024_Label" },
          align: { field: "labelAlign" },
          baseline: { field: "labelBaseline" },
          tooltip: null
        }
      },
      {
        data: { values: [{ label: "Visitors", y: cy - 8 }, { label: "(million)", y: cy + 17 }] },
        mark: { type: "text", font: "Inter", fontSize: 18, fontWeight: 900, color: colors.text },
        encoding: {
          x: { datum: cx, type: "quantitative", scale: { domain: xDomain }, axis: null },
          y: { field: "y", type: "quantitative", scale: { domain: yDomain }, axis: null },
          text: { field: "label" },
          tooltip: null
        }
      },
    ],
    config: { ...baseConfig(), view: { stroke: null } }
  };
}

const expenditureTiles = [
  {
    category: "Shopping",
    share: "37.4%",
    className: "shopping",
    icon: "bag",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1100&q=80"
  },
  {
    category: "Accommodation",
    share: "18.2%",
    className: "accommodation",
    icon: "bed",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80"
  },
  {
    category: "Food & Beverages",
    share: "15.4%",
    className: "food",
    icon: "utensils",
    image: "https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?auto=format&fit=crop&w=900&q=80"
  },
  {
    category: "International Airfares",
    legendLabel: "Airfares",
    share: "8.1%",
    className: "international-airfares",
    icon: "plane",
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800&q=80"
  },
  {
    category: "Local Transportation",
    share: "5.2%",
    className: "local-transportation",
    icon: "train",
    image: "https://images.unsplash.com/photo-1556122071-e404eaedb77f?auto=format&fit=crop&w=700&q=80"
  },
  {
    category: "Entertainment",
    compact: true,
    share: "4.0%",
    className: "entertainment",
    icon: "ticket",
    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80"
  },
  {
    category: "Organised Tour",
    compact: true,
    share: "3.1%",
    className: "organised-tour",
    icon: "flag",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=600&q=80"
  },
  {
    category: "Medical",
    compact: true,
    share: "2.6%",
    className: "medical",
    icon: "medical",
    image: "https://images.unsplash.com/photo-1584982751601-97dcc096659c?auto=format&fit=crop&w=600&q=80"
  },
  {
    category: "Domestic Airfares",
    compact: true,
    share: "2.1%",
    className: "domestic-airfares",
    icon: "plane",
    image: "https://images.unsplash.com/photo-1529074963764-98f45c47344b?auto=format&fit=crop&w=600&q=80"
  },
  {
    category: "Fuel",
    compact: true,
    share: "1.9%",
    className: "fuel",
    icon: "fuel",
    image: "https://images.unsplash.com/photo-1545558014-8692077e9b5c?auto=format&fit=crop&w=600&q=80"
  }
];

function expenditureSpec() {
  const width = chartWidth("#expenditure-chart", 780, 650);
  const height = 590;
  const shellX1 = 6;
  const shellX2 = width - 6;
  const shellY1 = 70;
  const shellY2 = 540;
  const shellW = shellX2 - shellX1;
  const gridPad = 16;
  const gx = shellX1 + gridPad;
  const gy = shellY1 + 64;
  const gw = shellW - gridPad * 2;
  const gh = shellY2 - gy - 24;
  const gap = 0;
  const col = gw / 12;
  const row = gh / 6;
  const tileColor = {
    shopping: "#2346d8",
    accommodation: "#7667ff",
    food: "#2e8b57",
    "international-airfares": "#f06a2a",
    "local-transportation": "#35a7a0",
    entertainment: "#c33f85",
    "organised-tour": "#7b67b4",
    medical: "#43b57d",
    "domestic-airfares": "#6fa8dc",
    fuel: "#f2b705"
  };
  const layout = [
    { className: "shopping", c: 0, r: 0, cs: 5.2, rs: 2.7, size: "large", label: "Shopping" },
    { className: "accommodation", c: 5.2, r: 0, cs: 3.4, rs: 2.7, size: "large", label: "Accommodation" },
    { className: "food", c: 8.6, r: 0, cs: 3.4, rs: 2.7, size: "large", label: "Food & Bev." },
    { className: "international-airfares", c: 0, r: 2.7, cs: 4, rs: 1.6, size: "medium", label: "Airfares" },
    { className: "local-transportation", c: 4, r: 2.7, cs: 3.3, rs: 1.6, size: "medium", label: "Local Transport" },
    { className: "entertainment", c: 7.3, r: 2.7, cs: 2.2, rs: 1.6, size: "compact", label: "Entertainment" },
    { className: "organised-tour", c: 9.5, r: 2.7, cs: 2.5, rs: 1.6, size: "compact", label: "Tour" },
    { className: "medical", c: 0, r: 4.3, cs: 3, rs: 1.3, size: "compact", label: "Medical" },
    { className: "domestic-airfares", c: 3, r: 4.3, cs: 3.7, rs: 1.3, size: "compact", label: "Domestic Air" },
    { className: "fuel", c: 6.7, r: 4.3, cs: 5.3, rs: 1.3, size: "compact", label: "Fuel" }
  ];
  const values = layout.map((slot) => {
    const tile = expenditureTiles.find((item) => item.className === slot.className);
    const x1 = gx + slot.c * col + gap / 2;
    const x2 = gx + (slot.c + slot.cs) * col - gap / 2;
    const y1 = gy + slot.r * row + gap / 2;
    const y2 = gy + (slot.r + slot.rs) * row - gap / 2;
    return {
      ...tile,
      ...slot,
      x1,
      x2,
      y1,
      y2,
      cx: (x1 + x2) / 2,
      cy: (y1 + y2) / 2,
      labelX: x1 + 16,
      labelY: y2 - 32,
      shareY: y2 - 10,
      imageX: (x1 + x2) / 2,
      imageY: (y1 + y2) / 2,
      imageW: Math.max(70, x2 - x1),
      imageH: Math.max(52, y2 - y1),
      fill: tileColor[slot.className],
      Category_Label: slot.label,
      isLarge: slot.size === "large",
      isCompact: slot.size === "compact"
    };
  });
  const largeValues = values.filter((tile) => tile.isLarge);
  const otherValues = values.filter((tile) => !tile.isLarge);
  const xScale = { domain: [0, width] };
  const yScale = { domain: [height, 0] };

  return {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    width,
    height,
    layer: [
      {
        data: { values: [{ x1: shellX1 + shellW * 0.36, x2: shellX1 + shellW * 0.64, y1: 18, y2: 94 }] },
        mark: { type: "rect", cornerRadius: 24, fill: null, stroke: "#07175f", strokeWidth: 7 },
        encoding: { x: { field: "x1", type: "quantitative", scale: xScale, axis: null }, x2: { field: "x2" }, y: { field: "y1", type: "quantitative", scale: yScale, axis: null }, y2: { field: "y2" }, tooltip: null }
      },
      {
        data: { values: [{ x1: shellX1, x2: shellX2, y1: shellY1, y2: shellY2 }] },
        mark: { type: "rect", cornerRadius: 28, color: "#f7faff", stroke: "#07175f", strokeWidth: 5 },
        encoding: { x: { field: "x1", type: "quantitative", scale: xScale, axis: null }, x2: { field: "x2" }, y: { field: "y1", type: "quantitative", scale: yScale, axis: null }, y2: { field: "y2" }, tooltip: null }
      },
      {
        data: { values: [
          { x1: shellX1 + 30, x2: shellX1 + 64, y1: shellY1 + 22, y2: shellY1 + 48 },
          { x1: width / 2 - 17, x2: width / 2 + 17, y1: shellY1 + 22, y2: shellY1 + 48 },
          { x1: shellX2 - 64, x2: shellX2 - 30, y1: shellY1 + 22, y2: shellY1 + 48 }
        ] },
        mark: { type: "rect", cornerRadius: 8, color: "#07175f" },
        encoding: { x: { field: "x1", type: "quantitative", scale: xScale, axis: null }, x2: { field: "x2" }, y: { field: "y1", type: "quantitative", scale: yScale, axis: null }, y2: { field: "y2" }, tooltip: null }
      },
      {
        data: { values },
        mark: { type: "rect", cornerRadius: 10, opacity: 0.92 },
        encoding: {
          x: { field: "x1", type: "quantitative", scale: xScale, axis: null },
          x2: { field: "x2" },
          y: { field: "y1", type: "quantitative", scale: yScale, axis: null },
          y2: { field: "y2" },
          color: { field: "fill", scale: null, legend: null },
          tooltip: [
            { field: "category", title: "Category" },
            { field: "share", title: "Share" }
          ]
        }
      },
      ...values.map((tile) => ({
        data: { values: [tile] },
        mark: { type: "image", width: tile.imageW, height: tile.imageH, aspect: false, opacity: 0.42 },
        encoding: {
          x: { field: "imageX", type: "quantitative", scale: xScale, axis: null },
          y: { field: "imageY", type: "quantitative", scale: yScale, axis: null },
          url: { field: "image" },
          tooltip: null
        }
      })),
      {
        data: { values: largeValues },
        mark: { type: "text", align: "left", baseline: "bottom", font: "Inter", fontWeight: 900, fontSize: 15, color: "#ffffff", limit: 135 },
        encoding: { x: { field: "labelX", type: "quantitative", scale: xScale, axis: null }, y: { field: "labelY", type: "quantitative", scale: yScale, axis: null }, text: { field: "Category_Label" }, tooltip: null }
      },
      {
        data: { values: largeValues },
        mark: { type: "text", align: "left", baseline: "bottom", font: "Bebas Neue", fontWeight: 900, fontSize: 31, color: "#ffffff" },
        encoding: { x: { field: "labelX", type: "quantitative", scale: xScale, axis: null }, y: { field: "shareY", type: "quantitative", scale: yScale, axis: null }, text: { field: "share" }, tooltip: null }
      },
      {
        data: { values: otherValues },
        mark: { type: "text", align: "left", baseline: "bottom", font: "Inter", fontWeight: 900, fontSize: 11, color: "#ffffff", limit: 95 },
        encoding: { x: { field: "labelX", type: "quantitative", scale: xScale, axis: null }, y: { field: "labelY", type: "quantitative", scale: yScale, axis: null }, text: { field: "Category_Label" }, tooltip: null }
      },
      {
        data: { values: otherValues },
        mark: { type: "text", align: "left", baseline: "bottom", font: "Bebas Neue", fontWeight: 900, fontSize: 24, color: "#ffffff" },
        encoding: { x: { field: "labelX", type: "quantitative", scale: xScale, axis: null }, y: { field: "shareY", type: "quantitative", scale: yScale, axis: null }, text: { field: "share" }, tooltip: null }
      },
      {
        data: { values: [{ x1: shellX2 - 130, x2: shellX2 - 26, y1: shellY1 + 14, y2: shellY1 + 60, label: "TOTAL", value: "100%" }] },
        mark: { type: "rect", cornerRadius: 14, color: "#ffffff", opacity: 0.92, stroke: "#dce6f3", strokeWidth: 1.2 },
        encoding: { x: { field: "x1", type: "quantitative", scale: xScale, axis: null }, x2: { field: "x2" }, y: { field: "y1", type: "quantitative", scale: yScale, axis: null }, y2: { field: "y2" }, tooltip: null }
      },
      {
        data: { values: [{ x: shellX2 - 78, y: shellY1 + 29, text: "TOTAL" }] },
        mark: { type: "text", align: "center", baseline: "middle", font: "Inter", fontWeight: 900, fontSize: 12, color: "#07175f" },
        encoding: { x: { field: "x", type: "quantitative", scale: xScale, axis: null }, y: { field: "y", type: "quantitative", scale: yScale, axis: null }, text: { field: "text" }, tooltip: null }
      },
      {
        data: { values: [{ x: shellX2 - 78, y: shellY1 + 49, text: "100%" }] },
        mark: { type: "text", align: "center", baseline: "middle", font: "Inter", fontWeight: 900, fontSize: 24, color: "#07175f" },
        encoding: { x: { field: "x", type: "quantitative", scale: xScale, axis: null }, y: { field: "y", type: "quantitative", scale: yScale, axis: null }, text: { field: "text" }, tooltip: null }
      }
    ],
    config: { ...baseConfig(), view: { stroke: null } }
  };
}

function domesticKeyIndicatorsSpec() {
  return {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    width: chartWidth("#domestic-key-indicators-chart", 820, 680),
    height: 380,
    title: {
      text: "Domestic Tourism Key Indicators",
      subtitle: "Indexed to 2017 = 100 to compare indicators with different units",
      fontSize: 24,
      subtitleFontSize: 15
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

function domesticStateVisitorsSpec() {
  const width = chartWidth("#domestic-state-visitors-chart", 820, 650);
  const height = 540;
  const maxVisitors = Math.max(...domesticStateRankings.map((row) => row.visitors));
  const rowTop = 118;
  const rowGap = 88;
  const rankX = 42;
  const copyX = 118;
  const photoX = 300;
  const maxPhotoW = width - photoX - 24;
  const rowH = 68;
  const values = domesticStateRankings.map((row, index) => {
    const y = rowTop + index * rowGap;
    const photoW = Math.max(285, (row.visitors / maxVisitors) * maxPhotoW);
    return {
      ...row,
      y,
      rowY1: y - rowH / 2,
      rowY2: y + rowH / 2,
      photoX1: photoX,
      photoX2: photoX + photoW,
      photoCX: photoX + photoW / 2,
      photoW,
      valueX: photoX + photoW - 18,
      stateY: y - 10,
      destY: y + 14,
      Visitors_Label: `${row.visitors.toFixed(1)}M`
    };
  });
  const xScale = { domain: [0, width] };
  const yScale = { domain: [height, 0] };

  return {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    width,
    height,
    layer: [
      {
        data: { values: [{ x: 0, y: 30, text: "TOP 5 DOMESTIC TOURISM STATES IN 2024" }] },
        mark: { type: "text", align: "left", baseline: "middle", font: "Inter", fontWeight: 900, fontSize: 24, color: "#07175f" },
        encoding: { x: { field: "x", type: "quantitative", scale: xScale, axis: null }, y: { field: "y", type: "quantitative", scale: yScale, axis: null }, text: { field: "text" }, tooltip: null }
      },
      {
        data: { values: [{ x: 0, y: 62, text: "By number of domestic visitors (million)" }] },
        mark: { type: "text", align: "left", baseline: "middle", font: "Inter", fontWeight: 600, fontSize: 15, color: "#4e5e78" },
        encoding: { x: { field: "x", type: "quantitative", scale: xScale, axis: null }, y: { field: "y", type: "quantitative", scale: yScale, axis: null }, text: { field: "text" }, tooltip: null }
      },
      {
        data: { values },
        mark: { type: "rect", cornerRadius: 16, color: "#f7fbff", stroke: "#dbe7f4", strokeWidth: 1 },
        encoding: { x: { datum: 0, type: "quantitative", scale: xScale, axis: null }, x2: { datum: width }, y: { field: "rowY1", type: "quantitative", scale: yScale, axis: null }, y2: { field: "rowY2" }, tooltip: null }
      },
      {
        data: { values },
        mark: { type: "text", align: "left", baseline: "middle", font: "Bebas Neue", fontWeight: 900, fontSize: 48 },
        encoding: { x: { datum: rankX, type: "quantitative", scale: xScale, axis: null }, y: { field: "y", type: "quantitative", scale: yScale, axis: null }, text: { field: "rank" }, color: { field: "accent", scale: null, legend: null }, tooltip: null }
      },
      {
        data: { values },
        mark: { type: "rule", stroke: "#c9d6e6", strokeWidth: 1 },
        encoding: { x: { datum: copyX - 18, type: "quantitative", scale: xScale, axis: null }, y: { field: "rowY1", type: "quantitative", scale: yScale, axis: null }, y2: { field: "rowY2" }, tooltip: null }
      },
      {
        data: { values },
        mark: { type: "text", align: "left", baseline: "middle", font: "Inter", fontWeight: 900, fontSize: 17, color: "#07175f", limit: 190 },
        encoding: { x: { datum: copyX, type: "quantitative", scale: xScale, axis: null }, y: { field: "stateY", type: "quantitative", scale: yScale, axis: null }, text: { field: "state" }, tooltip: null }
      },
      {
        data: { values },
        mark: { type: "text", align: "left", baseline: "middle", font: "Inter", fontWeight: 700, fontSize: 13, color: "#52647d", limit: 170 },
        encoding: { x: { datum: copyX, type: "quantitative", scale: xScale, axis: null }, y: { field: "destY", type: "quantitative", scale: yScale, axis: null }, text: { field: "destination" }, tooltip: null }
      },
      {
        data: { values },
        mark: { type: "rect", cornerRadius: 18, opacity: 0.16 },
        encoding: { x: { field: "photoX1", type: "quantitative", scale: xScale, axis: null }, x2: { field: "photoX2" }, y: { field: "rowY1", type: "quantitative", scale: yScale, axis: null }, y2: { field: "rowY2" }, color: { field: "accent", scale: null, legend: null }, tooltip: null }
      },
      ...values.map((row) => ({
        data: { values: [row] },
        mark: { type: "image", width: row.photoW, height: rowH, aspect: false, opacity: 0.86 },
        encoding: {
          x: { field: "photoCX", type: "quantitative", scale: xScale, axis: null },
          y: { field: "y", type: "quantitative", scale: yScale, axis: null },
          url: { field: "image" },
          tooltip: null
        }
      })),
      {
        data: { values },
        mark: { type: "rect", cornerRadius: 18, opacity: 0.52 },
        encoding: { x: { field: "photoX1", type: "quantitative", scale: xScale, axis: null }, x2: { field: "photoX2" }, y: { field: "rowY1", type: "quantitative", scale: yScale, axis: null }, y2: { field: "rowY2" }, color: { field: "accent", scale: null, legend: null }, tooltip: null }
      },
      {
        data: { values },
        mark: { type: "text", align: "right", baseline: "middle", font: "Bebas Neue", fontWeight: 900, fontSize: 36, color: "#ffffff" },
        encoding: { x: { field: "valueX", type: "quantitative", scale: xScale, axis: null }, y: { field: "y", type: "quantitative", scale: yScale, axis: null }, text: { field: "Visitors_Label" }, tooltip: null }
      },
      {
        data: { values },
        mark: { type: "text", align: "right", baseline: "middle", dx: -2, dy: 20, font: "Inter", fontWeight: 800, fontSize: 11, color: "#ffffff" },
        encoding: { x: { field: "valueX", type: "quantitative", scale: xScale, axis: null }, y: { field: "y", type: "quantitative", scale: yScale, axis: null }, text: { value: "visitors" }, tooltip: null }
      }
    ],
    config: { ...baseConfig(), view: { stroke: null } }
  };
}

function domesticPurposeSpec() {
  const width = chartWidth("#domestic-purpose-chart", 760, 650);
  const donutWidth = Math.min(360, Math.max(280, Math.floor(width * 0.48)));
  const growthWidth = Math.max(270, width - donutWidth - 34);
  const transportColors = {
    Land: "#2E8B57",
    Air: "#2E6DA4",
    Sea: "#6B5FB5",
    Rail: "#E86F22"
  };

  return {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    title: {
      text: "International Visitors by Mode of Transport",
      subtitle: "Donut shows 2024 arrival share; bars show growth vs 2023",
      fontSize: 24,
      subtitleFontSize: 14
    },
    data: { url: "data/mode_of_transport_2024_2023.csv" },
    transform: [
      { window: [{ op: "rank", as: "Rank" }], sort: [{ field: "Share_2024", order: "descending" }] },
      { calculate: "format(datum.Share_2024, '.1f') + '%'", as: "Share_Label" },
      { calculate: "(datum.Growth_Pct > 0 ? '+' : '') + format(datum.Growth_Pct, '.1f') + '%'", as: "Growth_Label" },
      { calculate: "datum.Mode + '  ' + datum.Share_Label", as: "Donut_Label" },
      { calculate: "datum.Growth_Label + ' YoY'", as: "Growth_Text" }
    ],
    hconcat: [
      {
        width: donutWidth,
        height: 310,
        layer: [
          {
            mark: { type: "arc", innerRadius: 82, outerRadius: 132, stroke: "#ffffff", strokeWidth: 3 },
            encoding: {
              theta: { field: "Share_2024", type: "quantitative", stack: true },
              order: { field: "Rank", type: "quantitative" },
              color: {
                field: "Mode",
                type: "nominal",
                legend: null,
                scale: { domain: Object.keys(transportColors), range: Object.values(transportColors) }
              },
              tooltip: [
                { field: "Mode", title: "Mode" },
                { field: "Visitors_2024", title: "Visitors 2024", format: "," },
                { field: "Share_2024", title: "Share 2024", format: ".1f" },
                { field: "Growth_Pct", title: "Growth vs 2023", format: "+.1f" }
              ]
            }
          },
          {
            transform: [{ filter: "datum.Share_2024 >= 3" }],
            mark: { type: "text", radius: 156, fontSize: 12, fontWeight: 900, color: colors.text },
            encoding: {
              theta: { field: "Share_2024", type: "quantitative", stack: "center" },
              order: { field: "Rank", type: "quantitative" },
              text: { field: "Donut_Label" }
            }
          },
          {
            data: { values: [{ label: "LAND" }] },
            mark: { type: "text", align: "center", baseline: "middle", dy: -24, fontSize: 25, fontWeight: 900, color: "#2E8B57" },
            encoding: { text: { field: "label" } }
          },
          {
            data: { values: [{ label: "66.1%" }] },
            mark: { type: "text", align: "center", baseline: "middle", dy: 12, fontSize: 36, fontWeight: 900, color: colors.text },
            encoding: { text: { field: "label" } }
          },
          {
            data: { values: [{ label: "of 2024 arrivals" }] },
            mark: { type: "text", align: "center", baseline: "middle", dy: 45, fontSize: 12, fontWeight: 800, color: colors.muted },
            encoding: { text: { field: "label" } }
          }
        ]
      },
      {
        width: growthWidth,
        height: 310,
        layer: [
          {
            mark: { type: "rule", color: "#cbd8e6", strokeWidth: 1.2 },
            encoding: {
              x: { datum: 0, type: "quantitative" }
            }
          },
          {
            mark: { type: "bar", cornerRadiusEnd: 7, height: { band: 0.54 }, opacity: 0.88 },
            encoding: {
              x: {
                field: "Growth_Pct",
                type: "quantitative",
                title: "Growth vs 2023 (%)",
                scale: { domain: [-8, 44] },
                axis: { tickCount: 6, grid: true, format: "+.0f" }
              },
              y: {
                field: "Mode",
                type: "nominal",
                title: null,
                sort: { field: "Share_2024", order: "descending" },
                axis: { labelFontWeight: 900, labelFontSize: 13 }
              },
              color: {
                condition: { test: "datum.Growth_Pct < 0", value: "#D84C4C" },
                value: "#2E9B9B"
              },
              tooltip: [
                { field: "Mode", title: "Mode" },
                { field: "Growth_Pct", title: "Growth vs 2023", format: "+.1f" },
                { field: "Share_2024", title: "Share 2024", format: ".1f" },
                { field: "Visitors_2024", title: "Visitors 2024", format: "," }
              ]
            }
          },
          {
            mark: { type: "text", align: "left", baseline: "middle", dx: 8, fontSize: 13, fontWeight: 900, color: colors.text },
            encoding: {
              x: { field: "Growth_Pct", type: "quantitative" },
              y: { field: "Mode", type: "nominal", sort: { field: "Share_2024", order: "descending" } },
              text: { field: "Growth_Text" }
            }
          },
          {
            mark: { type: "text", align: "right", baseline: "middle", fontSize: 12, fontWeight: 800, color: colors.muted },
            encoding: {
              x: { datum: 43, type: "quantitative" },
              y: { field: "Mode", type: "nominal", sort: { field: "Share_2024", order: "descending" } },
              text: { field: "Share_Label" }
            }
          }
        ]
      }
    ],
    spacing: 34,
    resolve: { scale: { x: "independent", y: "independent" } },
    config: baseConfig()
  };
}

function parseCsvRows(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];

    if (char === '"' && inQuotes && next === '"') {
      cell += '"';
      i += 1;
    } else if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      row.push(cell);
      cell = "";
    } else if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && next === "\n") i += 1;
      row.push(cell);
      if (row.some((value) => value !== "")) rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += char;
    }
  }

  if (cell || row.length) {
    row.push(cell);
    rows.push(row);
  }

  const headers = rows.shift() || [];
  return rows.map((values) =>
    Object.fromEntries(headers.map((header, index) => [header, values[index] || ""]))
  );
}

function polarPoint(cx, cy, radius, angleDeg) {
  const angle = (Math.PI / 180) * angleDeg;
  return {
    x: cx + radius * Math.cos(angle),
    y: cy + radius * Math.sin(angle)
  };
}

function petalPath(cx, cy, innerRadius, outerRadius, angleDeg, halfAngle) {
  const length = outerRadius - innerRadius;
  const angle = (Math.PI / 180) * angleDeg;
  const ux = Math.cos(angle);
  const uy = Math.sin(angle);
  const px = -uy;
  const py = ux;
  const point = (distance, offset = 0) => ({
    x: cx + ux * distance + px * offset,
    y: cy + uy * distance + py * offset
  });
  const angularWidth = outerRadius * Math.sin((Math.PI / 180) * halfAngle);
  const petalHalfWidth = Math.max(32, Math.min(110, angularWidth * 0.85, length * 0.42));
  const baseAngularWidth = (innerRadius + 14) * Math.sin((Math.PI / 180) * halfAngle);
  const baseHalfWidth = Math.max(16, Math.min(28, baseAngularWidth * 0.95, petalHalfWidth * 0.42));
  const capLift = Math.max(22, length * 0.14);
  const innerLeft = point(innerRadius, -baseHalfWidth);
  const innerRight = point(innerRadius, baseHalfWidth);
  const leftRootShoulder = point(innerRadius + length * 0.12, -petalHalfWidth * 0.68);
  const rightRootShoulder = point(innerRadius + length * 0.12, petalHalfWidth * 0.68);
  const leftBelly = point(innerRadius + length * 0.55, -petalHalfWidth * 0.95);
  const rightBelly = point(innerRadius + length * 0.55, petalHalfWidth * 0.95);
  const outerLeft = point(innerRadius + length * 0.85, -petalHalfWidth * 0.88);
  const outerRight = point(innerRadius + length * 0.85, petalHalfWidth * 0.88);
  const leftCapControl = point(outerRadius + capLift, -petalHalfWidth * 0.54);
  const rightCapControl = point(outerRadius + capLift, petalHalfWidth * 0.54);
  const innerMid = point(innerRadius - 12, 0);

  return [
    `M ${innerLeft.x.toFixed(1)} ${innerLeft.y.toFixed(1)}`,
    `C ${leftRootShoulder.x.toFixed(1)} ${leftRootShoulder.y.toFixed(1)} ${leftBelly.x.toFixed(1)} ${leftBelly.y.toFixed(1)} ${outerLeft.x.toFixed(1)} ${outerLeft.y.toFixed(1)}`,
    `C ${leftCapControl.x.toFixed(1)} ${leftCapControl.y.toFixed(1)} ${rightCapControl.x.toFixed(1)} ${rightCapControl.y.toFixed(1)} ${outerRight.x.toFixed(1)} ${outerRight.y.toFixed(1)}`,
    `C ${rightBelly.x.toFixed(1)} ${rightBelly.y.toFixed(1)} ${rightRootShoulder.x.toFixed(1)} ${rightRootShoulder.y.toFixed(1)} ${innerRight.x.toFixed(1)} ${innerRight.y.toFixed(1)}`,
    `Q ${innerMid.x.toFixed(1)} ${innerMid.y.toFixed(1)} ${innerLeft.x.toFixed(1)} ${innerLeft.y.toFixed(1)}`,
    "Z"
  ].join(" ");
}

function leaderPath(cx, cy, startRadius, endRadius, angleDeg, labelX) {
  const start = polarPoint(cx, cy, startRadius, angleDeg);
  const elbow = polarPoint(cx, cy, endRadius, angleDeg);
  const horizontal = labelX > cx ? 34 : -34;
  return `M ${start.x.toFixed(1)} ${start.y.toFixed(1)} L ${elbow.x.toFixed(1)} ${elbow.y.toFixed(1)} L ${(elbow.x + horizontal).toFixed(1)} ${elbow.y.toFixed(1)}`;
}

function labelForPurpose(purpose) {
  const labels = {
    "Visiting relatives & friends": ["Visiting relatives", "& friends"],
    Shopping: ["Shopping"],
    "Holiday/ leisure/ relaxation": ["Holiday / Leisure /", "Relaxation"],
    "Incentive travel/ others": ["Incentive travel /", "Others"],
    "Entertainment/ attending special event/ sports": ["Entertainment /", "Attend events"],
    "Medical treatment/ wellness": ["Medical treatment /", "Wellness"],
    "Religious worship/ visit places of worship": ["Religious worship /", "Visit"],
    "Official business/ business/ education": ["Official business /", "Business"],
    "Others / Not stated": ["Others /", "Not stated"]
  };
  return labels[purpose] || [purpose];
}




function domesticPurposeArcSpec() {
  const width = chartWidth("#domestic-purpose-chart", 760, 620);
  const height = 600;
  const data = [
    { Purpose: "Visiting relatives & friends", Share_Pct: 34.6, Rank: 1, Color: "#F05A7A" },
    { Purpose: "Shopping", Share_Pct: 27.6, Rank: 2, Color: "#F26B2A" },
    { Purpose: "Holiday/ leisure/ relaxation", Share_Pct: 14.6, Rank: 3, Color: "#F2B705" },
    { Purpose: "Incentive travel/ others", Share_Pct: 10.7, Rank: 4, Color: "#A8C51F" },
    { Purpose: "Entertainment/ attending special event/ sports", Share_Pct: 5.7, Rank: 5, Color: "#48B86E" },
    { Purpose: "Medical treatment/ wellness", Share_Pct: 4.5, Rank: 6, Color: "#3BB8AE" },
    { Purpose: "Others / Not stated", Share_Pct: 3.8, Rank: 7, Color: "#9B75C4" },
    { Purpose: "Religious worship/ visit places of worship", Share_Pct: 1.5, Rank: 8, Color: "#6FA8DC" },
    { Purpose: "Official business/ business/ education", Share_Pct: 0.8, Rank: 9, Color: "#7A61C9" }
  ];
  const maxShare = 34.6;
  const maxArc = 300;
  const ringWidth = 18;
  const ringGap = 22;
  const innerRadius = 86;
  const arcTransforms = [
    { calculate: `${innerRadius} + (10 - datum.Rank) * ${ringGap}`, as: "radius" },
    { calculate: `datum.radius - ${ringWidth / 2}`, as: "radiusInner" },
    { calculate: `datum.radius + ${ringWidth / 2}`, as: "radiusOuter" },
    { calculate: `(datum.Share_Pct / ${maxShare}) * ${maxArc}`, as: "arcEnd" }
  ];

  return {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    width,
    height,
    data: { values: data },
    layer: [
      {
        transform: arcTransforms,
        mark: { type: "arc", color: "#F1F5F9", cornerRadius: 9 },
        encoding: {
          theta: { datum: maxArc, type: "quantitative", scale: { domain: [0, 360], range: [0, 6.2832] } },
          theta2: { datum: 0 },
          radius: { field: "radiusOuter", type: "quantitative", scale: null },
          radius2: { field: "radiusInner", type: "quantitative", scale: null },
          tooltip: null
        }
      },
      {
        transform: arcTransforms,
        mark: { type: "arc", cornerRadius: 9, opacity: 0.72 },
        encoding: {
          theta: { field: "arcEnd", type: "quantitative", scale: { domain: [0, 360], range: [0, 6.2832] } },
          theta2: { datum: 0 },
          radius: { field: "radiusOuter", type: "quantitative", scale: null },
          radius2: { field: "radiusInner", type: "quantitative", scale: null },
          color: { field: "Color", scale: null, legend: null },
          tooltip: [
            { field: "Purpose", title: "Purpose" },
            { field: "Share_Pct", title: "Share", format: ".1f" }
          ]
        }
      },
      {
        data: { values: [
          { label: "100%", y: height / 2 + 6, size: 44 },
          { label: "Domestic Trips", y: height / 2 + 48, size: 14 },
          { label: "in 2024", y: height / 2 + 66, size: 14 }
        ] },
        mark: { type: "text", align: "center", baseline: "middle", font: "Inter", fontWeight: 900, color: colors.text },
        encoding: {
          x: { datum: width / 2, type: "quantitative", scale: { domain: [0, width] }, axis: null },
          y: { field: "y", type: "quantitative", scale: { domain: [height, 0] }, axis: null },
          text: { field: "label" },
          size: { field: "size", type: "quantitative", scale: null },
          tooltip: null
        }
      }
    ],
    config: { ...baseConfig(), view: { stroke: null } }
  };
}




function purposeIconMarkup(icon) {
  const icons = {
    family: `
      <circle cx="-8" cy="-18" r="6"></circle><path d="M-14 14v-18c0-8 12-8 12 0v18"></path>
      <circle cx="15" cy="-10" r="5"></circle><path d="M8 14v-13c0-7 14-7 14 0v13"></path>
      <circle cx="2" cy="-4" r="4"></circle><path d="M-3 15V5c0-5 10-5 10 0v10"></path>
    `,
    bag: `<path d="M-15 -9h30l-2 27h-26z"></path><path d="M-7 -9v-4c0-8 14-8 14 0v4"></path>`,
    sun: `<path d="M-18 10c8-11 28-11 36 0"></path><path d="M-10 16h20"></path><circle cx="10" cy="-12" r="6"></circle><path d="M10 -25v-6M10 7v6M-3 -12h-6M23 -12h6M0 -22l-4-4M20 -22l4-4M0 -2l-4 4M20 -2l4 4"></path>`,
    ticket: `<path d="M-18 -15h36v30h-36z"></path><path d="M-8 -6h8M-8 2h14M-8 10h10"></path>`,
    masks: `<path d="M-18 -8c8 2 15 0 22-5 3 17-4 27-16 27-7 0-10-9-6-22z"></path><path d="M4 -2c6 1 11 0 16-4 2 12-3 20-12 20-5 0-7-7-4-16z"></path><path d="M-10 4c3 3 7 3 10 0"></path>`,
    medical: `<path d="M-16 -14h32v28h-32z"></path><path d="M0 -7v14M-7 0h14"></path>`,
    worship: `<path d="M-18 16h36"></path><path d="M-13 16v-24l13-12 13 12v24"></path><path d="M-7 16V3c0-8 14-8 14 0v13"></path>`,
    briefcase: `<path d="M-18 -9h36v25h-36z"></path><path d="M-8 -9v-7h16v7M-18 0h36"></path>`,
    dots: `<circle cx="-12" cy="0" r="4"></circle><circle cx="0" cy="0" r="4"></circle><circle cx="12" cy="0" r="4"></circle>`
  };
  return icons[icon] || icons.dots;
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

function receiptsScatterSpec() {
  const width = chartWidth("#receipts-scatter-chart", 820, 680);
  return {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",

    width,
    height: 420,

    padding: {
      left: 30,
      right: 30,
      top: 10,
      bottom: 42
    },

    data: {
      url: "data/visitor_receipts_by_country_2024_2023.csv"
    },

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

      {
        calculate: "isValid(datum.Rank) ? toNumber(datum.Rank) : null",
        as: "Arrival_Rank"
      },

      {
        calculate: "datum.Receipts_2024_RM_Mil / 1000",
        as: "Receipts_RM_Bil"
      },

      { calculate: "0", as: "Zero" },

      {
        calculate:
          "'RM' + format(datum.Receipts_RM_Bil, '.1f') + 'B'",
        as: "Receipt_Label"
      },

      {
        calculate:
          "isValid(datum.Flag) ? datum.Flag + '  ' + datum.Country : datum.Country",
        as: "Market_Label"
      }
    ],

    layer: [
      {
        mark: {
          type: "rule",
          strokeWidth: 6
        },

        encoding: {
          x: {
            field: "Zero",
            type: "quantitative",
            scale: {
              domain: [0, 30]
            },
            axis: {
              title: "Tourism Receipts (RM Billion)",
              grid: true,
              labelFontSize: 11,
              titleFontSize: 12
            }
          },

          x2: {
            field: "Receipts_RM_Bil"
          },

          y: {
            field: "Market_Label",
            type: "nominal",
            sort: {
              field: "Receipt_Rank",
              order: "ascending"
            },

            axis: {
              labelFontSize: 13,
              labelFontWeight: 700,
              labelLimit: 210,
              title: null
            }
          },

          color: {
            condition: [
              {
                test: "datum.Country==='Singapore'",
                value: "#0B2A6F"
              },
              {
                test: "datum.Country==='China'",
                value: "#3B5BFF"
              }
            ],
            value: "#C9D7F2"
          }
        }
      },

      {
        mark: {
          type: "circle",
          stroke: "white",
          strokeWidth: 3
        },

        encoding: {
          x: {
            field: "Receipts_RM_Bil",
            type: "quantitative"
          },

          y: {
            field: "Market_Label",
            type: "nominal",
            sort: {
              field: "Receipt_Rank",
              order: "ascending"
            }
          },

          size: {
            condition: [
              {
                test: "datum.Country==='Singapore'",
              value: 980
              },
              {
                test: "datum.Country==='China'",
              value: 860
              }
            ],
            value: 520
          },

          color: {
            condition: [
              {
                test: "datum.Country==='Singapore'",
                value: "#0B2A6F"
              },
              {
                test: "datum.Country==='China'",
                value: "#3B5BFF"
              }
            ],
            value: "#9FB6DF"
          }
        }
      },

      {
        mark: {
          type: "text",
          dx: 18,
          align: "left",
          baseline: "middle",
          fontSize: 13,
          fontWeight: 900
        },

        encoding: {
          x: {
            field: "Receipts_RM_Bil",
            type: "quantitative"
          },

          y: {
            field: "Market_Label",
            type: "nominal",
            sort: {
              field: "Receipt_Rank",
              order: "ascending"
            }
          },

          text: {
            field: "Receipt_Label"
          }
        }
      }
    ],

    config: baseConfig()
  };
}

function stateGuestsSpec() {
  const width = chartWidth("#state-guests-chart", 860, 720);
  const halfWidth = Math.floor((width - 4) / 2);
  const mapHeight = 420;
  const peninsularCodes = ["KDH", "KTN", "PRK", "PNG", "KUL", "NSN", "MLK", "PLS", "PHG", "TRG", "PJY", "SGR", "JHR"];

  const growthMapLayer = (region, showLegend) => ({
    width: halfWidth,
    height: mapHeight,
    projection: {
      type: "mercator",
      center: region === "Peninsular" ? [101.65, 4.05] : [115.1, 4.0],
      scale: region === "Peninsular" ? 2850 : 1850,
      translate: [region === "Peninsular" ? halfWidth / 2 - 6 : halfWidth / 2 + 22, mapHeight / 2]
    },
    layer: [
      {
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
            legend: showLegend ? { orient: "bottom", direction: "horizontal", gradientLength: Math.min(520, width - 80), format: ".0f" } : null
          },
          tooltip: [
            { field: "state", title: "State" },
            { field: "Foreign_2024", title: "Foreign hotel guests 2024", format: "," },
            { field: "Growth", title: "Growth %", format: ".1f" }
          ]
        }
      },
      labelLayer(region, true),
      labelLayer(region, false)
    ]
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

const charts = [
  ["#monthly-trend-chart", monthlyTrendSpec],
  ["#domestic-purpose-chart", domesticPurposeArcSpec],
  ["#domestic-key-indicators-chart", domesticKeyIndicatorsSpec],
  ["#source-markets-chart", sourceMarketsSpec],
  ["#receipts-scatter-chart", receiptsScatterSpec],
  ["#domestic-state-visitors-chart", domesticStateVisitorsSpec],
  ["#arrivals-map", mapSpec],
  ["#expenditure-chart", expenditureSpec],
  ["#domestic-od-chart", domesticODSpec],
  ["#state-guests-chart", stateGuestsSpec]
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
