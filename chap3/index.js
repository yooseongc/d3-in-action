
(async () => {

    // load data
    const data = await d3.csv('../data/worldcup.csv');
    console.log(data);

    // load modal
    const modal = await d3.text('./modal.html');
    d3.select('body').append('div').attr('id', 'modal').html(modal);

    

    // draw teams
    d3.select('svg')
        .append('g')
        .attr('id', 'teamsG')
        .attr('transform', 'translate(50, 300)')
        .selectAll('g')
        .data(data)
        .enter()
        .append('g')
        .attr('class', 'overallG')
        .attr('transform', (d, i) => `translate(${i*50}, 0)`);

    
    const teamG = d3.selectAll('g.overallG');
    teamG.append('circle')
        .attr('r', 0)
        .transition()
        .delay((d, i) => i * 100)
        .duration(500)
        .attr('r', 40)
        .transition()
        .duration(500)
        .attr('r', 20)
        .style('fill', 'pink')
        .style('stroke', 'black')
        .style('stroke-width', '1px');
    teamG.append('text')
        .style('text-anchor', 'middle')
        .attr('y', 30)
        .style('font-size', '10px')
        .style('pointer-events', 'none')
        .text(d => d.team);
    teamG.insert('image', 'text')
        .attr('xlink:href', d => '../images/' + d.team + '.png')
        .attr('width', '45px')
        .attr('height', '20px')
        .attr('x', '-22')
        .attr('y', '-10');
    teamG.on('click', (e, d) => {
        d3.selectAll('td.data').data(Object.values(d)).html(p => p);
    });

    // controls
    const dataKeys = data.columns.filter(el => el !== 'team' && el !== 'region');
    d3.select('#controls')
        .selectAll('button.teams')
        .data(dataKeys)
        .enter()
        .append('button')
        .on('click', (e, key) => {
            const maxValue = d3.max(data, d => parseFloat(d[key]));
            const radiusScale = d3.scaleLinear().domain([0, maxValue]).range([2, 20]);
            const ybRamp = d3.scaleLinear().interpolate(d3.interpolateHsl).domain([0, maxValue]).range(['yellow', 'blue']);
            const tenColorScale = d3.scaleOrdinal(d3.schemeCategory10).domain(['UEFA', 'CONMEBOL', 'CAF', 'AFC']);
            d3.selectAll('g.overallG')
                .select('circle')
                .transition()
                .duration(1000)
                .attr('r', d => radiusScale(d[key]))
                .style('fill', d => tenColorScale(d['region']));
        })
        .html(d => d);
    
    teamG.on('mouseover', (e, d) => {
        const teamColor = d3.rgb('pink');
        d3.select(e.currentTarget)
            .select('text')
            .classed('active', true)
            .attr('y', 10);
        d3.selectAll('g.overallG')
            .select('circle')
            .style('fill', p => p.region === d.region ? teamColor.darker(.75) : teamColor.brighter(.5))
        e.currentTarget.parentElement.appendChild(e.currentTarget);
    }).on('mouseout', () => {
        d3.selectAll('g.overallG')
            .select('text')
            .classed('active', false)
            .attr('y', 30);
        d3.selectAll('g.overallG')
            .select('circle')
            .style('fill', 'pink');
        
    });

    // load svg
    const soccerball = await d3.html('./icon.svg');
    while (!d3.select(soccerball).selectAll('path').empty()) {
        d3.select('svg').node().appendChild(
            d3.select(soccerball).select('path').node()
        );
    }
    d3.selectAll('path').attr('transform', 'translate(50, 50)');

    
})();