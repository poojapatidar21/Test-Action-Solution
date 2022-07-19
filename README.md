# Integrating the ESRP Package Release Github Action into your Github Repository  Workflow
After you are onboarded to ESRP and ESRP Release, you may continue onto this section.
The information here is deliberately detailed, if you are experienced in the process you may wish to pick out the pertinent configuration details.

## Why it matters
The Github Action performs all the actions required to successfully create and submit the package files to the ESRP package release service. This includes:
- Generating a Zip file including the files mentioned in the repository
- Uploading that zip file to a blob store location accessible to ESRP
- Submits a valid ESRP request 
- Track the request progress on regular pre-defined interval

## Pre-Requisites 
To configure the Github Action, you will need to:
- Create an app registration in the Microsoft Azure Active Directory (AAD App ID) 
- Create an authentication key (Secret associated with app registered) for the AAD App ID (we recommend doing this during Github Action configuration).
- The PRSS Authentication Certificate [ESRP Information - Set up Certificate Based Authentication (sharepoint.com)](https://microsoft.sharepoint.com/teams/prss/esrp/info/ESRP%20Onboarding%20Wiki/Set%20up%20Certificate%20Based%20Authentication.aspx) + Signing Certificate [ESRP Information - Generating the ESRP Authentication (Request Signing) certificate (sharepoint.com)](https://microsoft.sharepoint.com/teams/prss/esrp/info/ESRP%20Onboarding%20Wiki/Generating%20the%20ESRP%20Authentication%20(Request%20Signing)%20certificate.aspx)
- Have an ADO org instance that does not have public project enabled (e.g., azure-sdk/public project) or have an internal project (e.g., azure-sdk/internal) that handles secrets access like singing and release. Secrets access should NOT be available/not an option in the public project, and auto pr builds are disabled on the pipelines.
 
If you have not completed the above, please go back and follow the instructions on the [main Wiki page](https://microsoft.sharepoint.com/teams/prss/esrp/info/ESRP%20Onboarding%20Wiki/ESRP%20Onboarding%20Guide%20Wiki.aspx)

## ​High Level Steps
1. Add the action in your workflow - you WILL need to use latest version of  Action – this action is available in Marketplace. 
2. Create an App registration in Azure Active Directory. 
3. Add App registration service principal to the Access policies of the AKV where the certificates reside. 
4. Add and configure the ESRP Release Task in your pipeline, along with the Service connection which will be leveraged by ADO task to communicate with ESRP.	


## Detailed Step by Step Guide 
The following are the detailed steps with embedded screenshots to provide additional clarification if required.  
1. Install the github Action 
Click on Marketplace and search [Github Action](https://github.com/marketplace/actions/test-action-solution)
![Marketplace](Sreenshots/Marketplace.png?raw=true)