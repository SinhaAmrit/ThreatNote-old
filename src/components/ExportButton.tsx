import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AdvisoryData } from "./AdvisoryForm";
import { getCurrentMascot, getCurrentDateIST } from "@/utils/mascotHelper";
import { useToast } from "@/hooks/use-toast";
import { FileText, Copy } from "lucide-react";
import ltimLogo from "@/assets/ltimindtree-official-logo.svg";
interface ExportButtonProps {
  advisories: AdvisoryData[];
}
export function ExportButton({
  advisories
}: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);
  const {
    toast
  } = useToast();
  const getBase64Image = async (imageSrc: string): Promise<string> => {
    try {
      const response = await fetch(imageSrc);
      const blob = await response.blob();
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64data = (reader.result as string).split(',')[1];
          resolve(base64data);
        };
        reader.readAsDataURL(blob);
      });
    } catch {
      return '';
    }
  };

  const generateEmailHTML = async () => {
    const currentMascot = getCurrentMascot();
    const currentDateIST = getCurrentDateIST();

    // Generate overall summary
    const criticalCount = advisories.filter(a => a.severity === "critical").length;
    const highCount = advisories.filter(a => a.severity === "high").length;
    const mediumCount = advisories.filter(a => a.severity === "medium").length;
    const threatNames = advisories.map(a => a.name).filter(Boolean);
    let severityText = "";
    const severityCounts = [];
    if (criticalCount > 0) severityCounts.push(`${criticalCount} classified as critical`);
    if (highCount > 0) severityCounts.push(`${highCount} as high`);
    if (mediumCount > 0) severityCounts.push(`${mediumCount} as medium`);
    if (severityCounts.length > 0) {
      severityText = ` including ${severityCounts.join(" and ")}`;
    }
    
    const getSeverityColorHex = (severity: string) => {
      const colors = {
        critical: '#ef4444',
        high: '#f97316', 
        medium: '#eab308',
        low: '#3b82f6',
        informational: '#6b7280'
      };
      return colors[severity as keyof typeof colors] || colors.informational;
    };
    
    // Key threats - using table layout for Outlook compatibility
    const keyThreatsHTML = threatNames.length > 0 ? 
      `<br><br>Key Threat${threatNames.length > 1 ? 's' : ''}: ` +
      advisories.filter(a => a.name).map(advisory => 
        `<table style="display: inline-table; vertical-align: middle; margin-right: 12px;"><tr>` +
        `<td style="width: 12px; height: 12px; background-color: ${getSeverityColorHex(advisory.severity)}; padding: 0; margin: 0; border: 0;"></td>` +
        `<td style="color: #FF6F00; font-weight: 600; padding-left: 6px; padding-top: 0; padding-bottom: 0; border: 0;">${advisory.name}</td>` +
        `</tr></table>`
      ).join('') : '';
    
    const overallSummary = `Today's <strong>${currentMascot.name}: <u>${currentMascot.description}</u></strong> advisory reports ${advisories.length} threat${advisories.length > 1 ? 's' : ''} identified across global landscapes${severityText}${keyThreatsHTML}`;
    
    // Outlook-safe email header with VML gradients and table layout
    const emailHeader = `
      <!-- Outer wrapper table for maximum compatibility -->
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 0; padding: 0; border-collapse: collapse; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
        <tr>
          <td align="center" style="padding: 20px;">
            <!-- Main container table -->
            <table border="0" cellpadding="0" cellspacing="0" width="90%" style="max-width: 90%; margin: 0 auto; border-collapse: collapse; background: #ffffff;">
              
              <!-- Header with gradient background and VML fallback -->
              <tr>
                <td style="padding: 0;">
                  <!--[if mso]>
                  <v:rect xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false" style="width: 100%; height: 200px;">
                    <v:fill type="gradient" color="#512DA8" color2="#6A42C2" angle="135" />
                    <v:textbox inset="30px,30px,30px,20px" style="mso-fit-shape-to-text:true;">
                  <![endif]-->
                  
                  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #512DA8; border-collapse: collapse;">
                    <tr>
                      <td style="padding: 30px; background: linear-gradient(135deg, #512DA8, #6A42C2);">
                      
                        <!--[if !mso]><!-- -->
                        <div style="background: linear-gradient(135deg, #512DA8, #6A42C2);">
                        <!--<![endif]-->
                        
                        <!-- Header content table -->
                        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse; margin-bottom: 25px;">
                          <tr>
                            <!-- Logo and title -->
                            <td width="70%" style="vertical-align: top;">
                              <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
                                <tr>
                                  <!-- Logo -->
                                  <td style="vertical-align: top; padding-right: 20px;">
                                    <!--[if mso]>
                                    <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" arcsize="13%" fill="true" stroke="false" style="width: 60px; height: 60px;">
                                      <v:fill color="#ffffff" />
                                      <v:textbox inset="12px,12px,12px,12px">
                                    <![endif]-->
                                    <div style="background: white; padding: 12px; width: 36px; height: 36px; border-radius: 8px; display: inline-block;">
                                      <img src="data:image/svg+xml;base64,${await getBase64Image(ltimLogo)}" 
                                           width="36" height="36" 
                                           alt="LTIMindtree" 
                                           style="display: block; border: 0;" />
                                    </div>
                                    <!--[if mso]>
                                      </v:textbox>
                                    </v:roundrect>
                                    <![endif]-->
                                  </td>
                                   <!-- Title text -->
                                  <td style="vertical-align: top;">
                                    <div style="font-size: 24px; font-weight: 700; margin-bottom: 8px; color: #ffffff; line-height: 1.2;">LTIMindtree Threat Intelligence Advisory</div>
                                    <div style="font-size: 16px; color: #ffffff;">Corporate Security Team</div>
                                  </td>
                                </tr>
                              </table>
                            </td>
                            <!-- Date -->
                            <td width="30%" style="text-align: right; font-size: 16px; color: #ffffff; vertical-align: top;">
                              ${currentDateIST}
                            </td>
                          </tr>
                        </table>
                        
                        <!-- Mascot section with semi-transparent background -->
                        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;">
                          <tr>
                            <td style="background: #7258D4; padding: 20px;">
                              <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
                                <tr>
                                  <!-- Mascot image -->
                                  <td style="vertical-align: top; padding-right: 20px;">
                                    <!--[if mso]>
                                    <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" arcsize="15%" fill="true" stroke="false" style="width: 80px; height: 80px;">
                                      <v:fill src="data:image/jpeg;base64,${await getBase64Image(currentMascot.image)}" type="frame" />
                                    </v:roundrect>
                                    <![endif]-->
                                    <div style="width: 80px; height: 80px; border-radius: 12px; overflow: hidden; display: inline-block;">
                                      <img src="data:image/jpeg;base64,${await getBase64Image(currentMascot.image)}" 
                                           width="80" height="80" 
                                           alt="${currentMascot.name}" 
                                           style="display: block; border: 0; width: 80px; height: 80px; object-fit: cover;" />
                                    </div>
                                  </td>
                                   <!-- Mascot text -->
                                  <td style="vertical-align: top;">
                                    <div style="font-size: 20px; font-weight: 700; margin-bottom: 8px; color: #ffffff; line-height: 1.2;">${currentMascot.name}</div>
                                    <div style="font-size: 16px; color: #ffffff; line-height: 1.4;">${currentMascot.description}</div>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                        
                        <!--[if !mso]><!-- -->
                        </div>
                        <!--<![endif]-->
                        
                      </td>
                    </tr>
                  </table>
                  
                  <!--[if mso]>
                    </v:textbox>
                  </v:rect>
                  <![endif]-->
                </td>
              </tr>
              
              <!-- Introduction & Summary with shadow wrapper -->
              <tr>
                <td style="padding: 20px;">
                  <!-- Shadow wrapper table -->
                  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;">
                    <!-- Light shadow background for Outlook -->
                    <tr>
                      <td style="background: #f5f5f5; padding: 2px;">
                        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse; background: #ffffff; border: 1px solid #e0e0e0;">
                          <tr>
                            <td style="padding: 30px;">
                              
                              <!-- Introduction text -->
                              <div style="margin: 0 0 25px 0; color: #666; font-size: 15px; line-height: 1.6;">
                                Hello Team,<br><br>
                                Please find below the Daily Threat Advisory from the Corporate Security Team. This report highlights key cybersecurity threats, vulnerabilities, and risks identified across global landscapes. We aim to keep you informed and prepared by providing timely insights into emerging security challenges.
                              </div>
                              
                              <!-- Summary box with gradient fallback -->
                              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse; margin-bottom: 0;">
                                <tr>
                                  <td style="padding: 0;">
                                    <!--[if mso]>
                                    <v:rect xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false" style="width: 100%;">
                                      <v:fill type="gradient" color="#f8f9fa" color2="#ffffff" angle="135" />
                                      <v:textbox inset="25px,25px,25px,25px">
                                    <![endif]-->
                                    
                                    <div style="background: #f8f9fa; background: linear-gradient(135deg, #f8f9fa, #ffffff); padding: 25px; border-left: 5px solid #FF6F00;">
                                      <h3 style="margin: 0 0 15px 0; color: #512DA8; font-size: 20px; font-weight: 700; line-height: 1.2;">
                                        Overall Summary
                                      </h3>
                                      <div style="margin: 0; color: #444; font-size: 16px; line-height: 1.6;">${overallSummary}</div>
                                    </div>
                                    
                                    <!--[if mso]>
                                      </v:textbox>
                                    </v:rect>
                                    <![endif]-->
                                  </td>
                                </tr>
                              </table>
                              
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
    `;

    // Advisory cards with table layouts
    const advisoryHTMLs = advisories.map(advisory => {
      const getSeverityStyle = (severity: string) => {
        const styles = {
          critical: 'background: #D32F2F; color: white;',
          high: 'background: #F57C00; color: white;',
          medium: 'background: #FBC02D; color: #333;',
          low: 'background: #1976D2; color: white;',
          informational: 'background: #9E9E9E; color: white;'
        };
        return styles[severity as keyof typeof styles] || styles.informational;
      };

      // Parse references into an array and limit to 3
      const referencesArray = advisory.references 
        ? advisory.references.split(',').map(ref => ref.trim()).filter(ref => ref.length > 0).slice(0, 3)
        : [];
      
      return `
        <!-- Advisory Card -->
        <tr>
          <td style="padding: 0 20px 40px 20px;">
            <!-- Shadow wrapper -->
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;">
              <tr>
                <td style="background: #f5f5f5; padding: 2px;">
                  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse; background: #ffffff; border: 1px solid #e0e0e0;">
                    <tr>
                      <td style="padding: 30px;">
                        
                        <!-- Header with title and severity badge -->
                        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse; margin-bottom: 25px;">
                          <tr>
                            <td width="70%" style="vertical-align: top;">
                              <h2 style="margin: 0; color: #FF6F00; font-size: 24px; font-weight: 700; line-height: 1.2;">${advisory.name}</h2>
                            </td>
                            <td width="30%" style="text-align: right; vertical-align: top;">
                              <!--[if mso]>
                              <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" arcsize="50%" fill="true" stroke="false" style="height: auto; width: auto;">
                                <v:fill color="${advisory.severity === 'critical' ? '#D32F2F' : advisory.severity === 'high' ? '#F57C00' : advisory.severity === 'medium' ? '#FBC02D' : advisory.severity === 'low' ? '#1976D2' : '#9E9E9E'}" />
                                <v:textbox inset="8px,20px,8px,20px">
                              <![endif]-->
                              <div style="${getSeverityStyle(advisory.severity)} padding: 8px 20px; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; display: inline-block; text-align: center;">
                                ${advisory.severity}${advisory.cvssScore && advisory.cvssScore !== "Not Found" ? ` • ${advisory.cvssScore}` : ''}
                              </div>
                              <!--[if mso]>
                                </v:textbox>
                              </v:roundrect>
                              <![endif]-->
                            </td>
                          </tr>
                        </table>
                        
                        ${advisory.attackType ? `
                        <!-- Attack Type -->
                        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse; border-bottom: 1px solid #f5f5f5;">
                          <tr>
                            <td style="padding: 20px 0;">
                              <h3 style="margin: 0 0 12px 0; color: #512DA8; font-size: 18px; font-weight: 600;">Attack Type</h3>
                              <div style="margin: 0; color: #555; line-height: 1.6; font-size: 16px;">${advisory.attackType}</div>
                            </td>
                          </tr>
                        </table>
                        ` : ''}
                        
                        ${advisory.vulnerability ? `
                        <!-- Vulnerability -->
                        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse; border-bottom: 1px solid #f5f5f5;">
                          <tr>
                            <td style="padding: 20px 0;">
                              <h3 style="margin: 0 0 12px 0; color: #512DA8; font-size: 18px; font-weight: 600;">Vulnerability</h3>
                              <div style="margin: 0; color: #555; line-height: 1.6; font-size: 16px;">${advisory.vulnerability}</div>
                            </td>
                          </tr>
                        </table>
                        ` : ''}
                        
                        ${advisory.summary ? `
                        <!-- Summary -->
                        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse; border-bottom: 1px solid #f5f5f5;">
                          <tr>
                            <td style="padding: 20px 0;">
                              <h3 style="margin: 0 0 12px 0; color: #512DA8; font-size: 18px; font-weight: 600;">Summary</h3>
                              <div style="margin: 0; color: #555; line-height: 1.6; font-size: 16px;">${advisory.summary}${advisory.readMoreLink ? ` <a href="${advisory.readMoreLink}" style="color: #FF6F00; text-decoration: none; font-weight: 600;">Read more...</a>` : ''}</div>
                            </td>
                          </tr>
                        </table>
                        ` : ''}
                        
                        ${advisory.threatActor || advisory.deliveryMethod ? `
                        <!-- Threat Actor & Delivery Method -->
                        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse; border-bottom: 1px solid #f5f5f5;">
                          <tr>
                            <td style="padding: 20px 0;">
                              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;">
                                <tr>
                                  ${advisory.threatActor ? `
                                  <td width="50%" style="vertical-align: top; padding-right: 15px;">
                                    <h3 style="margin: 0 0 12px 0; color: #512DA8; font-size: 18px; font-weight: 600;">Threat Actor</h3>
                                    <div style="margin: 0; color: #555; line-height: 1.6; font-size: 16px;">${advisory.threatActor}</div>
                                  </td>
                                  ` : ''}
                                  ${advisory.deliveryMethod ? `
                                  <td width="50%" style="vertical-align: top; padding-left: 15px;">
                                    <h3 style="margin: 0 0 12px 0; color: #512DA8; font-size: 18px; font-weight: 600;">Delivery Method</h3>
                                    <div style="margin: 0; color: #555; line-height: 1.6; font-size: 16px;">${advisory.deliveryMethod}</div>
                                  </td>
                                  ` : ''}
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                        ` : ''}
                        
                        ${advisory.mitigation ? `
                        <!-- Recommended Actions -->
                        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse; border-bottom: 1px solid #f5f5f5;">
                          <tr>
                            <td style="padding: 20px 0;">
                              <h3 style="margin: 0 0 12px 0; color: #512DA8; font-size: 18px; font-weight: 600;">Recommended Actions</h3>
                              <div style="margin: 0; color: #555; line-height: 1.6; font-size: 16px;">${advisory.mitigation}</div>
                            </td>
                          </tr>
                        </table>
                        ` : ''}
                        
                        ${referencesArray.length > 0 ? `
                        <!-- References -->
                        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;">
                          <tr>
                            <td style="padding: 20px 0 0 0;">
                              <h3 style="margin: 0 0 12px 0; color: #512DA8; font-size: 18px; font-weight: 600;">References</h3>
                              <div style="margin: 0; color: #555; font-size: 16px;">
                                ${referencesArray.map(ref => `• <a href="${ref}" style="color: #FF6F00; text-decoration: none; font-weight: 500;">${ref}</a><br>`).join('')}
                              </div>
                            </td>
                          </tr>
                        </table>
                        ` : ''}
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      `;
    });

    // Footer with gradient background
    const footer = `
              <!-- Footer -->
              <tr>
                <td style="padding: 0 20px 20px 20px;">
                  <!-- Shadow wrapper -->
                  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;">
                    <tr>
                      <td style="background: #f5f5f5; padding: 2px;">
                        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse; background: #f8f9fa; border: 1px solid #e0e0e0;">
                          <tr>
                            <td style="padding: 30px; text-align: center;">
                              
                              <div style="margin: 0 0 20px 0; color: #666; font-size: 14px; font-style: italic; line-height: 1.6;">
                                This is an internal LTIMindtree Threat Intel Advisory Do not share externally<br>
                                IoCs are being tracked in the GSOC excel sheet
                              </div>
                              
                              <div style="margin: 0 0 20px 0; color: #512DA8; font-size: 16px; font-weight: 600; line-height: 1.4;">
                                Regards<br>Corporate Security Team
                              </div>
                              
                              <!-- Mascot tagline button with VML fallback -->
                              <!--[if mso]>
                              <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" arcsize="10%" fill="true" stroke="false" style="height: 50px; width: 300px;">
                                <v:fill type="gradient" color="#512DA8" color2="#6A42C2" angle="135" />
                                <v:textbox inset="15px,25px,15px,25px" style="mso-fit-shape-to-text:true;">
                              <![endif]-->
                               <div style="background-color: #512DA8; padding: 15px 25px; font-size: 16px; font-weight: 600; display: inline-block; text-align: center; color: #ffffff;">
                                 <!--[if !mso]><!-- -->
                                 <div style="background: linear-gradient(135deg, #512DA8, #6A42C2); padding: 15px 25px; font-size: 16px; font-weight: 600; display: inline-block; text-align: center; color: #ffffff; margin: -15px -25px;">
                                 <!--<![endif]-->
                                 ${currentMascot.name} • ${currentMascot.tagline}
                                 <!--[if !mso]><!-- -->
                                 </div>
                                 <!--<![endif]-->
                               </div>
                              <!--[if mso]>
                                </v:textbox>
                              </v:roundrect>
                              <![endif]-->
                              
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              
            </table>
            <!-- End main container -->
          </td>
        </tr>
      </table>
      <!-- End outer wrapper -->
    `;

    return emailHeader + advisoryHTMLs.join('') + footer;
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
      setIsExporting(true);
      const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>LTIMindtree Threat Intelligence Advisory</title>
</head>
<body style="margin: 0; padding: 20px; background-color: #ffffff; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
  ${await generateEmailHTML()}
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
    } finally {
      setIsExporting(false);
    }
  };
  const downloadHTML = async () => {
    if (advisories.length === 0) {
      toast({
        variant: "destructive",
        title: "No Content",
        description: "Generate preview first before downloading HTML."
      });
      return;
    }
    try {
      setIsExporting(true);
      const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>LTIMindtree Threat Intelligence Advisory</title>
  <style>
    @media screen and (max-width: 768px) {
      body { padding: 10px !important; }
      .responsive { width: 100% !important; max-width: none !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 20px; background-color: #ffffff; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
  ${await generateEmailHTML()}
</body>
</html>`;
      const blob = new Blob([htmlContent], {
        type: 'text/html'
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `threatnote-advisory-${new Date().toISOString().split('T')[0]}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast({
        title: "HTML Downloaded",
        description: "Advisory HTML file downloaded successfully."
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Download Failed",
        description: "Failed to download HTML file."
      });
    } finally {
      setIsExporting(false);
    }
  };
  if (advisories.length === 0) return null;
  
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      <Button 
        onClick={copyToClipboard} 
        disabled={isExporting} 
        size="icon" 
        className="btn-ltim-accent shadow-lg h-12 w-12"
        title="Copy HTML to Clipboard"
      >
        <Copy className="w-5 h-5" />
      </Button>
      <Button 
        onClick={downloadHTML} 
        disabled={isExporting} 
        size="icon" 
        className="btn-ltim-accent shadow-lg h-12 w-12"
        title="Download HTML File"
      >
        <FileText className="w-5 h-5" />
      </Button>
    </div>
  );
}
