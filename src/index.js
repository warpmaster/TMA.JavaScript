import QueueVisualizer from './queue-visualizer.js';

const queueVisualizer = new QueueVisualizer();
const element = queueVisualizer.render();
const root = document.querySelector(".root");

root.append(element);
