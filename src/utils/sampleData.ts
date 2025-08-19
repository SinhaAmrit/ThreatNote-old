import { AdvisoryData } from "@/components/AdvisoryForm";

export const sampleAdvisories: AdvisoryData[] = [
  {
    id: "sample-1",
    name: "CVE-2024-Exchange-RCE",
    attackType: "Remote Code Execution",
    vulnerability: "Unauthenticated remote code execution in Microsoft Exchange Server allowing arbitrary code execution on vulnerable systems",
    severity: "critical",
    cvssScore: "9.8",
    date: new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' }),
    threatActor: "APT-Exchange-Hunter",
    deliveryMethod: "Direct exploitation via exposed Exchange servers",
    summary: "Microsoft has disclosed a critical remote code execution vulnerability in Exchange Server that allows attackers to execute arbitrary code. This vulnerability affects Exchange Server 2016, 2019, and the latest versions.",
    readMoreLink: "https://msrc.microsoft.com/update-guide/vulnerability/CVE-2024-12345",
    mitigation: "Apply Microsoft's security update immediately. Implement network segmentation to limit exposure. Monitor Exchange server logs for suspicious activities. Consider temporarily isolating Exchange servers from the internet if immediate patching is not possible.",
    references: "https://msrc.microsoft.com/update-guide/vulnerability/CVE-2024-12345, https://support.microsoft.com/en-us/help/12345"
  },
  {
    id: "sample-2", 
    name: "SupplyChain-DevTools-2024",
    attackType: "Supply Chain Attack",
    vulnerability: "Malicious packages infiltrating development environments to exfiltrate source code and credentials",
    severity: "high",
    cvssScore: "Not Found",
    date: new Date(Date.now() - 86400000).toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' }),
    threatActor: "DevStealer Group",
    deliveryMethod: "Compromised package repositories and IDE extensions",
    summary: "A sophisticated supply chain attack targeting popular development tools and package managers. The attack involves malicious packages that exfiltrate source code and development credentials.",
    readMoreLink: "https://blog.sonatype.com/supply-chain-attack-analysis-2024",
    mitigation: "Review and audit all recently installed packages and extensions. Implement package verification processes. Monitor network traffic for data exfiltration attempts. Use private package repositories where possible.",
    references: "https://blog.sonatype.com/supply-chain-attack-analysis-2024, https://github.com/security-advisories/supply-chain-attack"
  },
  {
    id: "sample-3",
    name: "Phishing-O365-Campaign",
    attackType: "Phishing Campaign",
    vulnerability: "Social engineering targeting Office 365 credentials through sophisticated phishing emails",
    severity: "medium",
    cvssScore: "6.4",
    date: new Date(Date.now() - 172800000).toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' }),
    threatActor: "PhishMaster Collective",
    deliveryMethod: "Email with malicious attachments and credential harvesting sites",
    summary: "Large-scale phishing campaign targeting Office 365 users with convincing login pages designed to steal credentials. Campaign shows high success rate due to sophisticated social engineering tactics.",
    readMoreLink: "https://security.microsoft.com/phishing-report-2024",
    mitigation: "Enable multi-factor authentication for all Office 365 accounts. Conduct user awareness training on phishing identification. Implement email security solutions to filter malicious emails.",
    references: "https://security.microsoft.com/phishing-report-2024, https://aka.ms/phishing-defense"
  }
];