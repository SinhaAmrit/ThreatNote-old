import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { AdvisoryForm, AdvisoryData } from "@/components/AdvisoryForm";
import { AdvisoryPreview } from "@/components/AdvisoryPreview";
import { ExportButton } from "@/components/ExportButton";
import { sampleAdvisories } from "@/utils/sampleData";
import { getCurrentMascot, getCurrentDateIST } from "@/utils/mascotHelper";
import { useToast } from "@/hooks/use-toast";
import { FileText, Mail, Download, Copy, Plus, AlertTriangle, Shield, Database, Sparkles } from "lucide-react";
import ltimLogo from "@/assets/ltimindtree-logo.svg";
const Index = () => {
  const [advisoryCount, setAdvisoryCount] = useState<number>(1);
  const [advisories, setAdvisories] = useState<AdvisoryData[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const {
    toast
  } = useToast();
  const createEmptyAdvisory = (index: number): AdvisoryData => ({
    id: `advisory-${Date.now()}-${index}`,
    name: "",
    attackType: "",
    vulnerability: "",
    severity: "informational",
    date: new Date().toLocaleDateString('en-CA', {
      timeZone: 'Asia/Kolkata'
    }),
    threatActor: "",
    deliveryMethod: "",
    summary: "",
    readMoreLink: "",
    mitigation: "",
    references: ""
  });
  const buildForms = () => {
    const newAdvisories = Array.from({
      length: advisoryCount
    }, (_, index) => createEmptyAdvisory(index));
    setAdvisories(newAdvisories);
    setShowPreview(false);
    toast({
      title: "Forms Created",
      description: `${advisoryCount} advisory form${advisoryCount > 1 ? 's' : ''} created successfully.`
    });
  };
  const loadSampleData = () => {
    const sampleData = sampleAdvisories.slice(0, advisoryCount).map((sample, index) => ({
      ...sample,
      id: `sample-${Date.now()}-${index}`
    }));
    setAdvisories(sampleData);
    setShowPreview(false);
    toast({
      title: "Sample Data Loaded",
      description: `${sampleData.length} sample advisor${sampleData.length > 1 ? 'ies' : 'y'} loaded successfully.`
    });
  };
  const generatePreview = () => {
    if (advisories.length === 0) {
      toast({
        variant: "destructive",
        title: "No Advisories",
        description: "Please build forms first before generating preview."
      });
      return;
    }
    const hasRequiredFields = advisories.every(advisory => advisory.name && advisory.summary && advisory.mitigation);
    if (!hasRequiredFields) {
      toast({
        variant: "destructive",
        title: "Missing Required Fields",
        description: "Please fill in all required fields (Name, Summary, Mitigation) for all advisories."
      });
      return;
    }
    setShowPreview(true);
    toast({
      title: "Preview Generated",
      description: "Outlook-ready preview generated successfully."
    });
  };
  const generateEmailHTML = () => {
    const currentMascot = getCurrentMascot();
    const currentDateIST = getCurrentDateIST();

    // Generate overall summary first
    const criticalCount = advisories.filter(a => a.severity === "critical").length;
    const highCount = advisories.filter(a => a.severity === "high").length;
    const mediumCount = advisories.filter(a => a.severity === "medium").length;
    const threatNames = advisories.map(a => a.name).filter(Boolean);
    const overallSummary = `Today's ${currentMascot.name} ${currentMascot.emoji} ${currentMascot.description} advisory covers ${advisories.length} threat${advisories.length > 1 ? 's' : ''} identified across global landscapes${criticalCount > 0 ? ` including ${criticalCount} critical threat${criticalCount > 1 ? 's' : ''}` : ''}${highCount > 0 ? `, ${highCount} high-severity threat${highCount > 1 ? 's' : ''}` : ''}${mediumCount > 0 ? `, ${mediumCount} medium-risk threat${mediumCount > 1 ? 's' : ''}` : ''}.`;
    const emailHeader = `
      <table cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 800px; margin: 0 auto 30px auto; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
        <!-- Header with Mascot -->
        <tr>
          <td style="background: linear-gradient(135deg, #512DA8, #6A42C2); padding: 20px; border-radius: 8px 8px 0 0; color: white;">
            <table cellpadding="0" cellspacing="0" border="0" width="100%">
              <tr>
                <td style="padding-bottom: 15px;">
                  <table cellpadding="0" cellspacing="0" border="0" width="100%">
                    <tr>
                      <td width="60" valign="middle">
                        <img src="${ltimLogo}" width="48" height="48" alt="LTIMindtree" style="background: white; padding: 8px; border-radius: 6px; display: block;" />
                      </td>
                      <td style="padding-left: 15px;">
                        <div style="font-size: 18px; font-weight: 600; margin-bottom: 5px;">LTIMindtree Threat Intelligence Advisory</div>
                        <div style="font-size: 14px; opacity: 0.9;">Corporate Security Team</div>
                      </td>
                      <td align="right" style="font-size: 14px; opacity: 0.9;">
                        ${currentDateIST}
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 8px;">
                  <table cellpadding="0" cellspacing="0" border="0" width="100%">
                    <tr>
                      <td width="64" valign="middle">
                        <img src="${currentMascot.image}" width="64" height="64" alt="${currentMascot.name}" style="border-radius: 8px; display: block;" />
                      </td>
                      <td style="padding-left: 15px;">
                        <div style="font-size: 16px; font-weight: 600; margin-bottom: 5px;">${currentMascot.name} ${currentMascot.emoji}</div>
                        <div style="font-size: 14px; opacity: 0.9;">${currentMascot.description}</div>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        
        <!-- Introduction & Summary -->
        <tr>
          <td style="background: white; padding: 20px; border-left: 1px solid #e0e0e0; border-right: 1px solid #e0e0e0;">
            <p style="margin: 0 0 15px 0; color: #666; font-size: 13px; font-style: italic;">
              Hello Team,<br><br>
              Please find below the Daily Threat Advisory from the Corporate Security Team. This report highlights key cybersecurity threats, vulnerabilities, and risks identified across global landscapes. We aim to keep you informed and prepared by providing timely insights into emerging security challenges.
            </p>
            <div style="background: #f8f9fa; padding: 15px; border-left: 4px solid #FF6F00; border-radius: 4px; margin-bottom: 20px;">
              <h3 style="margin: 0 0 10px 0; color: #512DA8; font-size: 16px; font-weight: 600;">🛡️ Overall Summary</h3>
              <p style="margin: 0; color: #555; font-size: 14px; line-height: 1.5;">${overallSummary}</p>
            </div>
          </td>
        </tr>
      </table>
    `;
    const advisoryHTMLs = advisories.map(advisory => {
      const getSeverityStyle = (severity: string) => {
        const styles = {
          critical: 'background: #D32F2F; color: white;',
          high: 'background: #F57C00; color: white;',
          medium: 'background: #FBC02D; color: #333;',
          low: 'background: #1976D2; color: white;',
          informational: 'background: #9E9E9E; color: white;'
        };
        return `${styles[severity as keyof typeof styles] || styles.informational} padding: 6px 16px; border-radius: 20px; font-size: 12px; font-weight: 600; display: inline-block;`;
      };
      return `
        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 800px; margin: 0 auto 30px auto; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
          <tr>
            <td style="background: white; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
              <table cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td>
                    <h2 style="margin: 0 0 15px 0; color: #512DA8; font-size: 20px; font-weight: 600;">${advisory.name}</h2>
                    <span style="${getSeverityStyle(advisory.severity)}">${advisory.severity.toUpperCase()}</span>
                  </td>
                </tr>
              </table>
              
              ${advisory.attackType ? `<div style="padding: 15px 0; border-bottom: 1px solid #f0f0f0;"><h3 style="margin: 0 0 8px 0; color: #512DA8; font-size: 16px; font-weight: 600;">Attack Type</h3><p style="margin: 0; color: #555; line-height: 1.5; font-size: 14px;">${advisory.attackType}</p></div>` : ''}
              
              ${advisory.vulnerability ? `<div style="padding: 15px 0; border-bottom: 1px solid #f0f0f0;"><h3 style="margin: 0 0 8px 0; color: #512DA8; font-size: 16px; font-weight: 600;">Vulnerability</h3><p style="margin: 0; color: #555; line-height: 1.5; font-size: 14px;">${advisory.vulnerability}</p></div>` : ''}
              
              ${advisory.summary ? `<div style="padding: 15px 0; border-bottom: 1px solid #f0f0f0;"><h3 style="margin: 0 0 8px 0; color: #512DA8; font-size: 16px; font-weight: 600;">Summary</h3><p style="margin: 0; color: #555; line-height: 1.5; font-size: 14px;">${advisory.summary}${advisory.readMoreLink ? ` <a href="${advisory.readMoreLink}" style="color: #FF6F00; text-decoration: none;">Read more...</a>` : ''}</p></div>` : ''}
              
              ${advisory.threatActor ? `<div style="padding: 15px 0; border-bottom: 1px solid #f0f0f0;"><h3 style="margin: 0 0 8px 0; color: #512DA8; font-size: 16px; font-weight: 600;">Threat Actor</h3><p style="margin: 0; color: #555; line-height: 1.5; font-size: 14px;">${advisory.threatActor}</p></div>` : ''}
              
              ${advisory.deliveryMethod ? `<div style="padding: 15px 0; border-bottom: 1px solid #f0f0f0;"><h3 style="margin: 0 0 8px 0; color: #512DA8; font-size: 16px; font-weight: 600;">Delivery Method</h3><p style="margin: 0; color: #555; line-height: 1.5; font-size: 14px;">${advisory.deliveryMethod}</p></div>` : ''}
              
              ${advisory.mitigation ? `<div style="padding: 15px 0; border-bottom: 1px solid #f0f0f0;"><h3 style="margin: 0 0 8px 0; color: #512DA8; font-size: 16px; font-weight: 600;">Recommended Actions</h3><p style="margin: 0; color: #555; line-height: 1.5; font-size: 14px;">${advisory.mitigation}</p></div>` : ''}
              
              ${advisory.references && advisory.references.trim() ? `
                <table cellpadding="0" cellspacing="0" border="0" width="100%" style="padding: 15px 0;">
                  <tr>
                    <td>
                      <h3 style="margin: 0 0 8px 0; color: #512DA8; font-size: 16px; font-weight: bold;">References</h3>
                      <ul style="margin: 0; padding-left: 20px; color: #555555; font-size: 14px;">
                        ${advisory.references.split(',').slice(0, 3).map(ref => {
        const trimmedRef = ref.trim();
        return trimmedRef ? `<li style="margin-bottom: 4px;"><a href="${trimmedRef}" style="color: #FF6F00; text-decoration: none;">${trimmedRef}</a></li>` : '';
      }).filter(Boolean).join('')}
                      </ul>
                    </td>
                  </tr>
                </table>` : ''}
            </td>
          </tr>
          
          <tr>
            <td style="background: #f8f9fa; padding: 15px 20px; border-radius: 0 0 8px 8px; border: 1px solid #e0e0e0; border-top: none;">
              <p style="margin: 0; color: #666; font-size: 12px; text-align: center; font-style: italic;">
                This is an internal LTIMindtree Threat Intel Advisory. Do not share externally without approval.<br>
                IoCs are being tracked in the GSOC excel sheet.
              </p>
            </td>
          </tr>
        </table>
      `;
    });
    return emailHeader + advisoryHTMLs.join('');
  };
  const copyToClipboard = async () => {
    if (advisories.length === 0) {
      toast({
        variant: "destructive",
        title: "No Content",
        description: "Generate preview first before copying HTML."
      });
      return;
    }
    try {
      const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>LTIMindtree Threat Intelligence Advisory</title>
</head>
<body style="margin: 0; padding: 20px; background-color: #f5f5f5; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
  ${generateEmailHTML()}
</body>
</html>`;
      await navigator.clipboard.writeText(htmlContent);
      toast({
        title: "HTML Copied",
        description: "Outlook-ready HTML copied to clipboard successfully."
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Copy Failed",
        description: "Failed to copy HTML to clipboard."
      });
    }
  };
  const downloadHTML = () => {
    if (advisories.length === 0) {
      toast({
        variant: "destructive",
        title: "No Content",
        description: "Generate preview first before downloading HTML."
      });
      return;
    }
    const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>LTIMindtree Threat Intelligence Advisory</title>
</head>
<body style="margin: 0; padding: 20px; background-color: #f5f5f5; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
  ${generateEmailHTML()}
</body>
</html>`;
    const blob = new Blob([htmlContent], {
      type: 'text/html'
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ltim-threat-advisory-${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast({
      title: "HTML Downloaded",
      description: "Advisory HTML file downloaded successfully."
    });
  };
  const updateAdvisory = (index: number, updatedAdvisory: AdvisoryData) => {
    const newAdvisories = [...advisories];
    newAdvisories[index] = updatedAdvisory;
    setAdvisories(newAdvisories);
  };
  return <div className="min-h-screen bg-background">
    {/* Header */}
    <header className="bg-white border-b shadow-sm sticky top-0 z-40">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Shield className="w-12 h-12 text-accent hover-scale" />
            <div>
              <h1 className="text-2xl font-bold text-primary">ThreatNote</h1>
              <p className="text-sm text-muted-foreground">Made with ❤ By <a href="https://www.google.com/search?q=sinhaamrit" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">Amrit Sinha</a></p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-accent" />

          </div>
        </div>
      </div>
    </header>

    <div className="container mx-auto px-6 py-8">
      {/* Control Panel */}
      <Card className="card-corporate mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-accent">
            <Database className="w-6 h-6" />
            <span className="text-primary">Advisory Configuration</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
            <div className="space-y-2">
              <label htmlFor="advisory-count" className="text-sm font-medium">
                Number of Advisories
              </label>
              <Select value={advisoryCount.toString()} onValueChange={val => setAdvisoryCount(Number(val))}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Advisory</SelectItem>
                  <SelectItem value="2">2 Advisories</SelectItem>
                  <SelectItem value="3">3 Advisories</SelectItem>
                  <SelectItem value="4">4 Advisories</SelectItem>
                  <SelectItem value="5">5 Advisories</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button onClick={buildForms} className="btn-ltim-primary btn-enhanced">
                <Plus className="w-4 h-4 mr-2" />
                Build Forms
              </Button>
              <Button onClick={loadSampleData} variant="outline" className="hover:bg-primary/10 hover:text-primary hover:border-primary btn-enhanced">
                <Sparkles className="w-4 h-4 mr-2" />
                Load Sample
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      {advisories.length > 0 && <Card className="card-corporate mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-accent">
            <FileText className="w-6 h-6" />
            <span className="text-primary">Export & Preview</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button onClick={generatePreview} className="btn-ltim-primary btn-enhanced">
              <Mail className="w-4 h-4 mr-2" />
              Generate Preview
            </Button>
            <Button onClick={copyToClipboard} variant="outline" className="hover:bg-primary/10 hover:text-primary hover:border-primary btn-enhanced">
              <Copy className="w-4 h-4 mr-2" />
              Copy HTML
            </Button>
            {/* <Button onClick={downloadHTML} className="btn-ltim-accent btn-enhanced">
                  <Download className="w-4 h-4 mr-2" />
                  Download HTML
                </Button> */}
          </div>
        </CardContent>
      </Card>}

      {/* Main Content */}
      <div className={`${advisories.length === 0 ? '' : 'grid grid-cols-1 xl:grid-cols-2 gap-8'}`}>
        {/* Forms Section */}
        <div className="space-y-6">
          {advisories.length > 0 && <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-accent" />
            <h2 className="text-xl font-semibold text-primary">Advisory Forms</h2>
          </div>}

          {advisories.map((advisory, index) => <AdvisoryForm key={advisory.id} advisory={advisory} onUpdate={updated => updateAdvisory(index, updated)} index={index} />)}

          {advisories.length === 0 && <Card className="card-corporate w-full">
            <CardContent className="text-center py-16">
              <Database className="w-16 h-16 text-muted-foreground mx-auto mb-6" />
              <h3 className="text-2xl font-semibold text-primary mb-4">Ready to Build</h3>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Select the number of advisories you want to create and click "Build Forms" to get started.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-lg mx-auto text-left">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span className="text-muted-foreground">Professional email formatting</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span className="text-muted-foreground">Outlook-compatible HTML</span>
                </div>
              </div>
            </CardContent>
          </Card>}
        </div>

        {/* Preview Section */}
        <div className="space-y-6">
          {showPreview && advisories.length > 0 && <div className="flex items-center gap-2 mb-4">
            <Mail className="w-5 h-5 text-accent" />
            <h2 className="text-xl font-semibold text-primary">Email Preview</h2>
          </div>}

          {showPreview && <div>
            <AdvisoryPreview advisories={advisories} />
            <ExportButton advisories={advisories} />
          </div>}

          {!showPreview && advisories.length > 0 && <Card className="card-corporate">
            <CardContent className="text-center py-12">
              <Mail className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-primary mb-2">Preview Ready</h3>
              <p className="text-muted-foreground mb-4">
                Fill in the advisory forms and click "Generate Preview" to see the Outlook-ready email format.
              </p>
              <Button onClick={generatePreview} className="btn-ltim-primary">
                <Mail className="w-4 h-4 mr-2" />
                Generate Preview
              </Button>
            </CardContent>
          </Card>}
        </div>
      </div>

      {/* Footer */}
      <Separator className="my-12" />
      <div className="text-center py-6">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Shield className="w-6 h-6 text-accent" />
          <span className="text-sm font-medium text-muted-foreground">Threat Intelligence Advisory Builder</span>
        </div>
        <p className="text-xs text-muted-foreground max-w-2xl mx-auto">This tool generates professional, Outlook-compatible threat intelligence advisories with corporate branding. All generated content follows internal security communication standards. We do not store any data.</p>
      </div>
    </div>
  </div>;
};
export default Index;