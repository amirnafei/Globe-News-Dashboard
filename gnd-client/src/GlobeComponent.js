import React from 'react';
import Detector from './third-party/Detector';
import TWEEN from './third-party/Tween';
import { three as THREE } from 'three';
import config from './CONFIG.js';

import DAT from './globe';

class GlobeComponent extends React.Component {
    constructor() {
        super();
    }

    componentWillMount() {
        document.addEventListener("mouseup", (event)=>this.props.locationHandler(event.flag));
    }

    componentDidMount() {
        if (!Detector.webgl) {
            Detector.addGetWebGLMessage();
        } else {

            var years = ['1990', '1995'];
            var container = this.globe;
            var globe = new DAT.Globe(container);

            var i, tweens = [];

            var settime = function (globe, t) {
                return function () {
                    new TWEEN.Tween(globe).to({ time: t / years.length }, 500).easing(TWEEN.Easing.Cubic.EaseOut).start();
                    var y = document.getElementById('year' + years[t]);
                    if (y.getAttribute('class') === 'year active') {
                        return;
                    }
                    var yy = document.getElementsByClassName('year');
                    for (i = 0; i < yy.length; i++) {
                        yy[i].setAttribute('class', 'year');
                    }
                    y.setAttribute('class', 'year active');
                };
            };

            for (var i = 0; i < years.length; i++) {
                var y = document.getElementById('year' + years[i]);
                y.addEventListener('mouseover', settime(globe, i), false);
            }

            var xhr;
            TWEEN.start();


            xhr = new XMLHttpRequest();
            xhr.open('GET', config.api + `/data`, true);
            xhr.onreadystatechange = function (e) {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        var data = JSON.parse(xhr.responseText);
                        window.data = data;
                        for (i = 0; i < data.length; i++) {
                            globe.addData(data[i][1], { format: 'magnitude', name: data[i][0], animated: true });
                        }
                        globe.createPoints();
                        settime(globe, 0)();
                        globe.animate();
                        document.body.style.backgroundImage = 'none'; // remove loading
                    }
                }
            };
            xhr.send(null);
        }
    }

    render() {
        return (
            <div className="GlobeContainer">
                <div ref={ref=>this.globe=ref}></div>

                {/* <div id="info">
                    <strong><a href="http://www.chromeexperiments.com/globe">WebGL Globe</a></strong> <span className="bull">&bull;</span> Created by the Google Data Arts Team <span className="bull">&bull;</span> Data acquired from <a href="http://sedac.ciesin.columbia.edu/gpw/">SEDAC</a>
                </div> */}

                <div id="currentInfo">
                    <span id="year1990" className="year">Population</span>
                    <span id="year1995" className="year">Tweets</span>
                </div>

                <div id="title">
                    Globe News Dashboard
                </div>

                {/* <a id="ce" href="http://www.chromeexperiments.com/globe">
                    <span>This is a Chrome Experiment</span>
                </a> */}

            </div>
            
        )
    }
}

export default GlobeComponent;