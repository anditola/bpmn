/**
 * AUTHOR: mrassinger
 * COPYRIGHT: E2E Technologies Ltd.
 */

var bpmnProcessModule = require('../../../../lib/process.js');
var errorQueueModule = require("../../../../lib/parsing/errors.js");
var BPMNProcessDefinition = require('../../../../lib/parsing/processDefinition.js').BPMNProcessDefinition;
var BPMNTask = require("../../../../lib/parsing/tasks.js").BPMNTask;
var BPMNStartEvent = require("../../../../lib/parsing/startEvents.js").BPMNStartEvent;
var BPMNEndEvent = require("../../../../lib/parsing/endEvents.js").BPMNEndEvent;
var BPMNSequenceFlow = require("../../../../lib/parsing/sequenceFlows.js").BPMNSequenceFlow;

exports.testValidateBPMNTask_OK = function(test) {
    /** @type {BPMNProcessDefinition} */
    var processDefinition = new BPMNProcessDefinition("PROCESS_1", "myProcess");
    processDefinition.addFlowObject(new BPMNStartEvent("_2", "MyStart", "startEvent"));
    processDefinition.addFlowObject(new BPMNTask("_3", "MyTask", "task"));
    processDefinition.addFlowObject(new BPMNEndEvent("_5", "MyEnd", "endEvent"));
    processDefinition.addSequenceFlow(new BPMNSequenceFlow("_4", "flow1", "sequenceFlow", "_2", "_3"));
    processDefinition.addSequenceFlow(new BPMNSequenceFlow("_6", "flow2", "sequenceFlow", "_3", "_5"));

    var errorQueue = errorQueueModule.createBPMNParseErrorQueue();
    processDefinition.validate(errorQueue);

    var errors = errorQueue.getErrors();
    test.deepEqual(errors,
        [],
        "testValidateBPMNTask_OK");
    test.done();

};

exports.testValidateBPMNTask_FO1 = function(test) {
    /** @type {BPMNProcessDefinition} */
    var processDefinition = new BPMNProcessDefinition("PROCESS_1", "myProcess");
    processDefinition.addFlowObject(new BPMNStartEvent("_2", "MyStart", "startEvent"));
    processDefinition.addFlowObject(new BPMNTask("_3", "", "task"));
    processDefinition.addFlowObject(new BPMNEndEvent("_5", "MyEnd", "endEvent"));
    processDefinition.addSequenceFlow(new BPMNSequenceFlow("_4", "flow1", "sequenceFlow", "_2", "_3"));
    processDefinition.addSequenceFlow(new BPMNSequenceFlow("_6", "flow2", "sequenceFlow", "_3", "_5"));

    var errorQueue = errorQueueModule.createBPMNParseErrorQueue();
    processDefinition.validate(errorQueue);

    var errors = errorQueue.getErrors();
    test.deepEqual(errors,
        [
            {
                "code": "FO1",
                "description": "Found a task flow object having no name. BPMN id='_3'.",
                "bpmnId": "_3",
                "bpmnName": "",
                "bpmnType": "task"
            }
        ],
        "testValidateBPMNTask_FO1");
    test.done();

};

exports.testValidateBPMNTask_FO2 = function(test) {
    /** @type {BPMNProcessDefinition} */
    var processDefinition = new BPMNProcessDefinition("PROCESS_1", "myProcess");
    processDefinition.addFlowObject(new BPMNStartEvent("_2", "MyStart", "startEvent"));
    processDefinition.addFlowObject(new BPMNTask("_3", "MyTask", "task"));
    processDefinition.addSequenceFlow(new BPMNSequenceFlow("_4", "flow1", "sequenceFlow", "_2", "_3"));

    var errorQueue = errorQueueModule.createBPMNParseErrorQueue();
    processDefinition.validate(errorQueue);

    var errors = errorQueue.getErrors();
    test.deepEqual(errors,
        [
            {
                "code": "FO2",
                "description": "The task 'MyTask' must have at least one outgoing sequence flow.",
                "bpmnId": "_3",
                "bpmnName": "MyTask",
                "bpmnType": "task"
            }
        ],
        "testValidateBPMNTask_FO2");
    test.done();

};

exports.testValidateBPMNTask_FO5 = function(test) {
    /** @type {BPMNProcessDefinition} */
    var processDefinition = new BPMNProcessDefinition("PROCESS_1", "myProcess");
    processDefinition.addFlowObject(new BPMNTask("_3", "MyTask", "task"));
    processDefinition.addFlowObject(new BPMNEndEvent("_5", "MyEnd", "endEvent"));
    processDefinition.addSequenceFlow(new BPMNSequenceFlow("_6", "flow2", "sequenceFlow", "_3", "_5"));

    var errorQueue = errorQueueModule.createBPMNParseErrorQueue();
    processDefinition.validate(errorQueue);

    var errors = errorQueue.getErrors();
    test.deepEqual(errors,
        [
            {
                "code": "FO5",
                "description": "The task 'MyTask' must have at least one incoming sequence flow.",
                "bpmnId": "_3",
                "bpmnName": "MyTask",
                "bpmnType": "task"
            }
        ],
        "testValidateBPMNTask_F05");
    test.done();

};