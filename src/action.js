const core=require('@actions/core');
const github=require('@actions/github');

try {
    const name=core.getInput('who-to-greet');
    console.log(`Hello ${name}`);
    const ConnectedServiceName= core.getInput('ConnectedServiceName');
    console.log(ConnectedServiceName);
    
} catch(error){
    core.setFailed(error.message);
}