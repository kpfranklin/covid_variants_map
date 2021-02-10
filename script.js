const margin = {top: 0, right: 0, bottom: 0, left: 0};
const width = 700;
const height = 512; // <-- Replace with actual height of interactive

const svg = d3
  .select('#interactive')
  .append('svg')
  .attr('viewBox', `0 0 ${width} ${height}`)
  .attr('preserveAspectRatio', 'xMinYMin');

// - - - - - - Unique code here: - - - - - - - //

const g0 = svg.append('g');
const g1 = svg.append('g');
const g2 = svg.append('g');
const g3 = svg.append('g');
const g4 = svg.append('g');

// Map projections:
const projection_US = d3.geoMercator().scale(699).center([-85.15, 36]);
const mapPath_US = d3.geoPath(projection_US);

const projection_AK = d3.geoMercator().scale(300).center([-78, 75]);
const mapPath_AK = d3.geoPath(projection_AK);

const projection_HI = d3.geoMercator().scale(700).center([-140, 36.2]);
const mapPath_HI = d3.geoPath(projection_HI);

const projection_PR = d3.geoMercator().scale(700).center([-56, 35.2]);
const mapPath_PR = d3.geoPath(projection_PR);

// Color scale:
const colorScale = d3
  .scaleThreshold()
  .domain([0.5, 1.0, 1.5, 2.0, 2.5, 3.0])
  .range(['#EFC8B9', '#DF897C', '#D15851', '#C4161C', '#9C1B1E', '#790000']);

// Number formatter:
const totalFormatter = d3.format(',');

/* - - - - -  DATA: - - - - - - - */
// https://www.sciencemag.org/sites/default/files/ne_50m_US_States_Lakes.geojson
d3.json(
  'https://raw.githubusercontent.com/kpfranklin/covid_variants_map/main/ne_50m_US_States_Lakes.geojson'
).then(data => {
  const countries = data;
  console.log(countries.features);

  const clickOff = g0
    .append('rect')
    .attr('id', 'background_rect')
    .attr('x', 0)
    .attr('y', 0)
    .attr('width', 700)
    .attr('height', 512)
    .attr('fill', 'white')
    .attr('stroke', 'none')
    .on('click', function () {
      d3.selectAll('.states_outline').attr('opacity', 0);
      d3.selectAll('.Alaska_States, .Hawaii_States, .Puerto_Rico_States').attr(
        'stroke',
        'white'
      );
      d3.selectAll('.textBox').attr('opacity', 0);
    });

  const UnitedStates = g1
    .append('g')
    .selectAll('path')
    .data(countries.features)
    .join('path')
    .attr('d', mapPath_US)
    .attr('fill', d => colorScale(d.properties.Percentage))
    .attr('stroke', 'white')
    .attr('class', 'states')
    .attr('id', d => d.properties.State_Name)
    .on('click', function (d) {
      d3.selectAll('.states_outline').attr('opacity', 0);
      d3.selectAll('.Alaska_States, .Hawaii_States, .Puerto_Rico_States').attr(
        'stroke',
        'white'
      );
      d3.select(`#outline_${d.properties.State_Name}`).attr('opacity', 1);
      d3.selectAll('.textBox').attr('opacity', 1);
      d3.select('#textBox_state').text(`${d.properties.name}`);
      d3.select('#textBox_total').text(
        `${totalFormatter(d.properties.Sequenced_Cases)}`
      );
      d3.select('#textBox_percent').text(`${d.properties.Percentage}%`);
    });

  d3.selectAll('#Hawaii, #Alaska, #Puerto_Rico').remove();

  //Black outlines
  const UnitedStates_outlines = g1
    .append('g')
    .selectAll('path')
    .data(countries.features)
    .join('path')
    .attr('d', mapPath_US)
    .attr('fill', 'none')
    .attr('stroke', 'black')
    .attr('stroke-width', 1.2)
    .attr('class', 'states_outline')
    .attr('id', d => `outline_${d.properties.State_Name}`)
    .attr('opacity', 0)
    .on('mouseover', function () {
      d3.select(this).style('pointer-events', 'none');
    });

  const Alaska = g2
    .append('g')
    .selectAll('path')
    .data(countries.features)
    .join('path')
    .attr('d', mapPath_AK)
    .attr('fill', d => colorScale(d.properties.Percentage))
    .attr('stroke', 'white')
    .attr('class', 'Alaska_States')
    .attr('id', d => `Alaska_${d.properties.State_Name}`)
    .on('click', function (d) {
      d3.selectAll('.states_outline').attr('opacity', 0);
      d3.selectAll('.Hawaii_States, .Puerto_Rico_States').attr(
        'stroke',
        'white'
      );
      d3.select(this).attr('stroke', 'black');
      d3.selectAll('.textBox').attr('opacity', 1);
      d3.select('#textBox_state').text(`${d.properties.name}`);
      d3.select('#textBox_total').text(
        `${totalFormatter(d.properties.Sequenced_Cases)}`
      );
      d3.select('#textBox_percent').text(`${d.properties.Percentage}%`);
    });

  const otherStates_Alaska = d3
    .selectAll('.Alaska_States')
    .filter(function (d) {
      return d.properties.State_Name != 'Alaska';
    });
  otherStates_Alaska.remove();

  const Hawaii = g3
    .append('g')
    .selectAll('path')
    .data(countries.features)
    .join('path')
    .attr('d', mapPath_HI)
    .attr('fill', d => colorScale(d.properties.Percentage))
    .attr('stroke', 'white')
    .attr('class', 'Hawaii_States')
    .attr('id', d => `Hawaii_${d.properties.State_Name}`)
    .on('click', function (d) {
      d3.selectAll('.states_outline').attr('opacity', 0);
      d3.selectAll('.Alaska_States, .Puerto_Rico_States').attr(
        'stroke',
        'white'
      );
      d3.select(this).attr('stroke', 'black');
      d3.selectAll('.textBox').attr('opacity', 1);
      d3.select('#textBox_state').text(`${d.properties.name}`);
      d3.select('#textBox_total').text(
        `${totalFormatter(d.properties.Sequenced_Cases)}`
      );
      d3.select('#textBox_percent').text(`${d.properties.Percentage}%`);
    });

  const otherStates_Hawaii = d3
    .selectAll('.Hawaii_States')
    .filter(function (d) {
      return d.properties.State_Name != 'Hawaii';
    });
  otherStates_Hawaii.remove();

  const PuertoRico = g4
    .append('g')
    .selectAll('path')
    .data(countries.features)
    .join('path')
    .attr('d', mapPath_PR)
    .attr('fill', d => colorScale(d.properties.Percentage))
    .attr('stroke', 'white')
    .attr('class', 'Puerto_Rico_States')
    .attr('id', d => `Puerto_Rico_${d.properties.State_Name}`)
    .on('click', function (d) {
      d3.selectAll('.states_outline').attr('opacity', 0);
      d3.selectAll('.Alaska_States, .Hawaii_States').attr('stroke', 'white');
      d3.select(this).attr('stroke', 'black');
      d3.selectAll('.textBox').attr('opacity', 1);
      d3.select('#textBox_state').text(`${d.properties.name}`);
      d3.select('#textBox_total').text(
        `${totalFormatter(d.properties.Sequenced_Cases)}`
      );
      d3.select('#textBox_percent').text(`${d.properties.Percentage}%`);
    });

  const otherStates_Puerto_Rico = d3
    .selectAll('.Puerto_Rico_States')
    .filter(function (d) {
      return d.properties.State_Name != 'Puerto_Rico';
    });
  otherStates_Puerto_Rico.remove();

  // State Labels:
  const US_Labels = g4
    .append('g')
    .selectAll('text')
    .data(countries.features)
    .join('text')
    .attr('fill', 'black')
    .text(d => d.properties.postal)
    .attr('class', d => `state_labels ${d.properties.postal}`)
    .attr('id', d => `state_${d.properties.postal}`)
    .attr(
      'x',
      d =>
        projection_US([
          d.properties.longitude - 0.8,
          d.properties.latitude - 0.3,
        ])[0]
    )
    .attr(
      'y',
      d =>
        projection_US([
          d.properties.longitude - 0.8,
          d.properties.latitude - 0.3,
        ])[1]
    )
    .on('mouseover', function () {
      d3.select(this).style('pointer-events', 'none');
    });

  d3.selectAll('#state_NY, #state_MI').attr('transform', 'translate(5,5)');
  d3.select('#state_MN').attr('transform', 'translate(-15,5)');
  d3.select('#state_MT').attr('transform', 'translate(10,2)');
  d3.selectAll('#state_OK, #state_AR, #state_TX').attr(
    'transform',
    'translate(-3,0)'
  );
  d3.select('#state_LA').attr('transform', 'translate(-6,-5)');
  d3.selectAll('#state_FL, #state_AZ, #state_NV, #state_IL, #state_IN').attr(
    'transform',
    'translate(3,0)'
  );
  d3.select('#state_NM').attr('transform', 'translate(0,3)');
  d3.select('#state_ME').attr('transform', 'translate(2,-5)');
  d3.select('#state_VT').attr('transform', 'translate(3,-6)');
  d3.selectAll('#state_NH, #state_UT').attr('transform', 'translate(1,4)');
  d3.select('#state_MA').attr('transform', 'translate(35,0)');
  d3.select('#state_RI').attr('transform', 'translate(30,0)');
  d3.select('#state_CT').attr('transform', 'translate(12,18)');
  d3.select('#state_NJ').attr('transform', 'translate(21,4)');
  d3.select('#state_DE').attr('transform', 'translate(22,0)');
  d3.select('#state_MD').attr('transform', 'translate(42,23)');
  d3.select('#state_DC').attr('transform', 'translate(42,30)');
  d3.select('#state_WV').attr('transform', 'translate(-5,5)');
  d3.select('#state_KY').attr('transform', 'translate(12,0)');
  d3.select('#state_AK').attr('transform', 'translate(428, 740)');
  d3.select('#state_HI').attr('transform', 'translate(705, -10)');
  d3.select('#state_PR').attr('transform', 'translate(-1165, -263)');

  d3.selectAll('#state_WY, #state_ME, #state_WA, #state_UT, #state_OR').attr(
    'fill',
    'white'
  );
  d3.selectAll(
    '#state_VT, #state_NH, #state_MA, #state_RI, #state_CT, #state_NJ, #state_DE, #state_MD'
  ).style('font-size', '0.85rem');

  d3.select('#state_DC').remove();

  const MA_line = g4
    .append('line')
    .attr('class', 'label_lines MA')
    .attr('x1', projection_US([-72, 42.38])[0])
    .attr('y1', projection_US([-72, 42.38])[1])
    .attr('x2', projection_US([-70.2, 42.38])[0])
    .attr('y2', projection_US([-70.2, 42.38])[1])
    .attr('stroke', 'black')
    .attr('opacity', 1)
    .on('mouseover', function () {
      d3.select(this).style('pointer-events', 'none');
    });

  const MA_Dot = g4
    .append('circle')
    .attr('class', 'label_lines MA')
    .attr('cx', projection_US([-72, 42.38])[0])
    .attr('cy', projection_US([-72, 42.38])[1])
    .attr('r', 2.5)
    .attr('fill', 'black')
    .attr('opacity', 1)
    .on('mouseover', function () {
      d3.select(this).style('pointer-events', 'none');
    });

  const RI_line = g4
    .append('line')
    .attr('class', 'label_lines RI')
    .attr('x1', projection_US([-71.7, 41.6242])[0])
    .attr('y1', projection_US([-71.7, 41.6242])[1])
    .attr('x2', projection_US([-70.2, 41.6242])[0])
    .attr('y2', projection_US([-70.2, 41.6242])[1])
    .attr('stroke', 'black')
    .attr('opacity', 1)
    .on('mouseover', function () {
      d3.select(this).style('pointer-events', 'none');
    });

  const RI_Dot = g4
    .append('circle')
    .attr('class', 'label_lines RI')
    .attr('cx', projection_US([-71.7, 41.6242])[0])
    .attr('cy', projection_US([-71.7, 41.6242])[1])
    .attr('r', 2.5)
    .attr('fill', 'black')
    .attr('opacity', 1)
    .on('mouseover', function () {
      d3.select(this).style('pointer-events', 'none');
    });

  const CT_line = g4
    .append('line')
    .attr('class', 'label_lines CT')
    .attr('x1', projection_US([-72.3, 41.65])[0])
    .attr('y1', projection_US([-72.3, 41.65])[1])
    .attr('x2', projection_US([-72.3, 41.05])[0])
    .attr('y2', projection_US([-72.3, 41.05])[1])
    .attr('stroke', 'black')
    .attr('opacity', 1)
    .on('mouseover', function () {
      d3.select(this).style('pointer-events', 'none');
    });

  const CT_Dot = g4
    .append('circle')
    .attr('class', 'label_lines CT')
    .attr('cx', projection_US([-72.3, 41.65])[0])
    .attr('cy', projection_US([-72.3, 41.65])[1])
    .attr('r', 2.5)
    .attr('fill', 'black')
    .attr('opacity', 1)
    .on('mouseover', function () {
      d3.select(this).style('pointer-events', 'none');
    });

  const NJ_line = g4
    .append('line')
    .attr('class', 'label_lines NJ')
    .attr('x1', projection_US([-73.7, 39.8])[0])
    .attr('y1', projection_US([-73.7, 39.8])[1])
    .attr('x2', projection_US([-74.6, 39.8])[0])
    .attr('y2', projection_US([-74.6, 39.8])[1])
    .attr('stroke', 'black')
    .attr('opacity', 1)
    .on('mouseover', function () {
      d3.select(this).style('pointer-events', 'none');
    });

  const NJ_Dot = g4
    .append('circle')
    .attr('class', 'label_lines NJ')
    .attr('cx', projection_US([-74.6, 39.8])[0])
    .attr('cy', projection_US([-74.6, 39.8])[1])
    .attr('r', 2.5)
    .attr('fill', 'black')
    .attr('opacity', 1)
    .on('mouseover', function () {
      d3.select(this).style('pointer-events', 'none');
    });

  const DE_line = g4
    .append('line')
    .attr('class', 'label_lines DE')
    .attr('x1', projection_US([-75.5, 38.9])[0])
    .attr('y1', projection_US([-75.5, 38.9])[1])
    .attr('x2', projection_US([-74.6, 38.9])[0])
    .attr('y2', projection_US([-74.6, 38.9])[1])
    .attr('stroke', 'black')
    .attr('opacity', 1)
    .on('mouseover', function () {
      d3.select(this).style('pointer-events', 'none');
    });

  const DE_Dot = g4
    .append('circle')
    .attr('class', 'label_lines DE')
    .attr('cx', projection_US([-75.5, 38.9])[0])
    .attr('cy', projection_US([-75.5, 38.9])[1])
    .attr('r', 2.5)
    .attr('fill', 'black')
    .attr('opacity', 1)
    .on('mouseover', function () {
      d3.select(this).style('pointer-events', 'none');
    });

  const MD_line1 = g4
    .append('line')
    .attr('class', 'label_lines MD')
    .attr('x1', projection_US([-76.8, 37.9])[0])
    .attr('y1', projection_US([-76.8, 37.9])[1])
    .attr('x2', projection_US([-74.6, 37.9])[0])
    .attr('y2', projection_US([-74.6, 37.9])[1])
    .attr('stroke', 'black')
    .attr('opacity', 1)
    .on('mouseover', function () {
      d3.select(this).style('pointer-events', 'none');
    });

  const MD_line2 = g4
    .append('line')
    .attr('class', 'label_lines MD')
    .attr('x1', projection_US([-76.8, 37.9])[0])
    .attr('y1', projection_US([-76.8, 37.9])[1])
    .attr('x2', projection_US([-76.8, 39.3])[0])
    .attr('y2', projection_US([-76.8, 39.3])[1])
    .attr('stroke', 'black')
    .attr('opacity', 1)
    .on('mouseover', function () {
      d3.select(this).style('pointer-events', 'none');
    });

  const MD_Dot = g4
    .append('circle')
    .attr('class', 'label_lines MD')
    .attr('cx', projection_US([-76.8, 39.3])[0])
    .attr('cy', projection_US([-76.8, 39.3])[1])
    .attr('r', 2.5)
    .attr('fill', 'black')
    .attr('opacity', 1)
    .on('mouseover', function () {
      d3.select(this).style('pointer-events', 'none');
    });

  const PR_line = g4
    .append('line')
    .attr('class', 'label_lines PR')
    .attr('x1', projection_US([-95.5, 20.6])[0])
    .attr('y1', projection_US([-95.5, 20.6])[1])
    .attr('x2', projection_US([-95.5, 19.2])[0])
    .attr('y2', projection_US([-95.5, 19.2])[1])
    .attr('stroke', 'black')
    .attr('opacity', 1)
    .on('mouseover', function () {
      d3.select(this).style('pointer-events', 'none');
    });

  const PR_Dot = g4
    .append('circle')
    .attr('class', 'label_lines PR')
    .attr('cx', projection_US([-95.5, 19.2])[0])
    .attr('cy', projection_US([-95.5, 19.2])[1])
    .attr('r', 2.5)
    .attr('fill', 'black')
    .attr('opacity', 1)
    .on('mouseover', function () {
      d3.select(this).style('pointer-events', 'none');
    });

  const HI_line = g4
    .append('line')
    .attr('class', 'label_lines HI')
    .attr('x1', projection_US([-100.5, 21.7])[0])
    .attr('y1', projection_US([-100.5, 21.7])[1])
    .attr('x2', projection_US([-100.5, 19.4])[0])
    .attr('y2', projection_US([-100.5, 19.4])[1])
    .attr('stroke', 'black')
    .attr('opacity', 1)
    .on('mouseover', function () {
      d3.select(this).style('pointer-events', 'none');
    });

  const HI_Dot = g4
    .append('circle')
    .attr('class', 'label_lines HI')
    .attr('cx', projection_US([-100.5, 19.4])[0])
    .attr('cy', projection_US([-100.5, 19.4])[1])
    .attr('r', 2.5)
    .attr('fill', 'black')
    .attr('opacity', 1)
    .on('mouseover', function () {
      d3.select(this).style('pointer-events', 'none');
    });

  // - - - - - - - Legend: - - - - - - -
  // Titles
  const legendTitle1 = g1
    .append('text')
    .attr('class', 'legend_title')
    .attr('x', projection_US([-75, 33])[0])
    .attr('y', projection_US([-75, 33])[1])
    .attr('text-anchor', 'start')
    .attr('fill', 'black')
    .text('Percentage');

  const legendTitle2 = g1
    .append('text')
    .attr('class', 'legend_title')
    .attr('x', projection_US([-75, 31.25])[0])
    .attr('y', projection_US([-75, 31.25])[1])
    .attr('text-anchor', 'start')
    .attr('fill', 'black')
    .text('of samples');

  const legendTitle3 = g1
    .append('text')
    .attr('class', 'legend_title')
    .attr('x', projection_US([-75, 29.5])[0])
    .attr('y', projection_US([-75, 29.5])[1])
    .attr('text-anchor', 'start')
    .attr('fill', 'black')
    .text('sequenced');

  // Circles:
  const legendCircle1 = g1
    .append('circle')
    .attr('class', 'legend_circle')
    .attr('cx', projection_US([-74.5, 28])[0])
    .attr('cy', projection_US([-74.5, 28])[1])
    .attr('r', 6)
    .attr('fill', '#EFC8B9');

  const legendCircle2 = g1
    .append('circle')
    .attr('class', 'legend_circle')
    .attr('cx', projection_US([-74.5, 26])[0])
    .attr('cy', projection_US([-74.5, 26])[1])
    .attr('r', 6)
    .attr('fill', '#DF897C');

  const legendCircle3 = g1
    .append('circle')
    .attr('class', 'legend_circle')
    .attr('cx', projection_US([-74.5, 24])[0])
    .attr('cy', projection_US([-74.5, 24])[1])
    .attr('r', 6)
    .attr('fill', '#D15851');

  const legendCircle4 = g1
    .append('circle')
    .attr('class', 'legend_circle')
    .attr('cx', projection_US([-74.5, 22])[0])
    .attr('cy', projection_US([-74.5, 22])[1])
    .attr('r', 6)
    .attr('fill', '#C4161C');

  const legendCircle5 = g1
    .append('circle')
    .attr('class', 'legend_circle')
    .attr('cx', projection_US([-74.5, 20])[0])
    .attr('cy', projection_US([-74.5, 20])[1])
    .attr('r', 6)
    .attr('fill', '#9C1B1E');

  const legendCircle6 = g1
    .append('circle')
    .attr('class', 'legend_circle')
    .attr('cx', projection_US([-74.5, 18])[0])
    .attr('cy', projection_US([-74.5, 18])[1])
    .attr('r', 6)
    .attr('fill', '#790000');

  // Text:
  const legendText1 = g1
    .append('text')
    .attr('class', 'legend_item')
    .attr('x', projection_US([-73.3, 27.6])[0])
    .attr('y', projection_US([-73.3, 27.6])[1])
    .attr('text-anchor', 'start')
    .attr('fill', 'black')
    .text('0%–0.5%');

  const legendText2 = g1
    .append('text')
    .attr('class', 'legend_item')
    .attr('x', projection_US([-73.3, 25.6])[0])
    .attr('y', projection_US([-73.3, 25.6])[1])
    .attr('text-anchor', 'start')
    .attr('fill', 'black')
    .text('0.5%–1%');

  const legendText3 = g1
    .append('text')
    .attr('class', 'legend_item')
    .attr('x', projection_US([-73.3, 23.6])[0])
    .attr('y', projection_US([-73.3, 23.6])[1])
    .attr('text-anchor', 'start')
    .attr('fill', 'black')
    .text('1%–1.5%');

  const legendText4 = g1
    .append('text')
    .attr('class', 'legend_item')
    .attr('x', projection_US([-73.3, 21.6])[0])
    .attr('y', projection_US([-73.3, 21.6])[1])
    .attr('text-anchor', 'start')
    .attr('fill', 'black')
    .text('1.5%–2%');

  const legendText5 = g1
    .append('text')
    .attr('class', 'legend_item')
    .attr('x', projection_US([-73.3, 19.6])[0])
    .attr('y', projection_US([-73.3, 19.6])[1])
    .attr('text-anchor', 'start')
    .attr('fill', 'black')
    .text('2%–2.5%');

  const legendText6 = g1
    .append('text')
    .attr('class', 'legend_item')
    .attr('x', projection_US([-73.3, 17.6])[0])
    .attr('y', projection_US([-73.3, 17.6])[1])
    .attr('text-anchor', 'start')
    .attr('fill', 'black')
    .text('2.5%–3%');

  // Pop up info:
  const textBox = g4
    .append('rect')
    .attr('class', 'textBox')
    .attr('x', projection_US([-85, 50.5])[0])
    .attr('y', projection_US([-85, 50.5])[1])
    .attr('width', 175)
    .attr('height', 64)
    .attr('fill', 'none')
    .attr('stroke', '#C1C1C1')
    .attr('opacity', 0);

  const textBox_state = g1
    .append('text')
    .attr('class', 'textBox')
    .attr('id', 'textBox_state')
    .attr('x', projection_US([-77.8, 49.5])[0])
    .attr('y', projection_US([-77.8, 49.5])[1])
    .attr('text-anchor', 'middle')
    .attr('fill', 'black')
    .text('New Hampshire')
    .attr('opacity', 0);

  const textBox_totalLead = g1
    .append('text')
    .attr('class', 'textBox textBox_leads')
    .attr('x', projection_US([-84.5, 48.5])[0])
    .attr('y', projection_US([-84.5, 48.5])[1])
    .attr('text-anchor', 'start')
    .attr('fill', 'black')
    .text('Number sequenced:')
    .attr('opacity', 0);

  const textBox_total = g1
    .append('text')
    .attr('class', 'textBox textBox_numbers')
    .attr('id', 'textBox_total')
    .attr('x', projection_US([-74.9, 48.5])[0])
    .attr('y', projection_US([-74.9, 48.5])[1])
    .attr('text-anchor', 'start')
    .attr('fill', 'black')
    .text('12,256')
    .attr('opacity', 0);

  const textBox_percentlLead = g1
    .append('text')
    .attr('class', 'textBox textBox_leads')
    .attr('x', projection_US([-84.5, 47.5])[0])
    .attr('y', projection_US([-84.5, 47.5])[1])
    .attr('text-anchor', 'start')
    .attr('fill', 'black')
    .text('Percent sequenced:')
    .attr('opacity', 0);

  const textBox_percent = g1
    .append('text')
    .attr('class', 'textBox textBox_numbers')
    .attr('id', 'textBox_percent')
    .attr('x', projection_US([-75, 47.5])[0])
    .attr('y', projection_US([-75, 47.5])[1])
    .attr('text-anchor', 'start')
    .attr('fill', 'black')
    .text('2.59%')
    .attr('opacity', 0);
});
