const core=require('@actions/core');
const github=require('@actions/github');

try {
    const name=core.getInput('who-to-greet');
    console.log(`Hello ${name}`);
    const ConnectedServiceName=core.getInput('ConnectedServiceName');
    console.log(`Hello ${ConnectedServiceName}`);

    const time=(new Date()).toTimeString();
    core.setOutput("time",time);

    const payload=JSON.stringify(github.context.payload,undefined,2)
        console.log(`the event payloaad: ${payload}`);
} catch(error){
    core.setFailed(error.message);
}