import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AdvisoryData } from "./AdvisoryForm";
import { getCurrentMascot, getCurrentDateIST } from "@/utils/mascotHelper";
import { useToast } from "@/hooks/use-toast";
import { FileText, Download, Copy } from "lucide-react";
import ltimLogo from "@/assets/ltimindtree-official-logo.svg";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
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
    
    const keyThreatsHTML = threatNames.length > 0 ? 
      `<br><br>Key Threat${threatNames.length > 1 ? 's' : ''}: ${advisories.filter(a => a.name).map(advisory => 
        `<span style="display: inline-flex; align-items: center; gap: 6px; margin-right: 12px;"><span style="display: inline-block; width: 12px; height: 12px; border-radius: 2px; background-color: ${getSeverityColorHex(advisory.severity)};"></span><span style="color: #FF6F00; font-weight: 600;">${advisory.name}</span></span>`
      ).join('')}` : '';
    
    const overallSummary = `Today's <strong>${currentMascot.name}: <u>${currentMascot.description}</u></strong> advisory reports ${advisories.length} threat${advisories.length > 1 ? 's' : ''} identified across global landscapes${severityText}${keyThreatsHTML}`;
    const emailHeader = `
      <div style="max-width: 900px; margin: 0 auto; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #ffffff;">
        <!-- Header with Mascot -->
        <div style="background: linear-gradient(135deg, #512DA8, #6A42C2); padding: 30px; border-radius: 12px 12px 0 0; color: white; margin-bottom: 0;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 25px;">
            <div style="display: flex; align-items: center; gap: 20px;">
              <img src="data:image/svg+xml;base64,${await getBase64Image(ltimLogo)}" 
                   width="60" height="60" 
                   alt="LTIMindtree" 
                   style="background: white; padding: 12px; border-radius: 8px; display: block;" />
              <div>
                <div style="font-size: 24px; font-weight: 700; margin-bottom: 8px;">LTIMindtree Threat Intelligence Advisory</div>
                <div style="font-size: 16px; opacity: 0.9;">Corporate Security Team</div>
              </div>
            </div>
            <div style="text-align: right; font-size: 16px; opacity: 0.9;">
              ${currentDateIST}
            </div>
          </div>
          
          <div style="background: rgba(255,255,255,0.15); padding: 20px; border-radius: 12px; display: flex; align-items: center; gap: 20px;">
            <img src="data:image/jpeg;base64,${await getBase64Image(currentMascot.image)}" 
                 width="80" height="80" 
                 alt="${currentMascot.name}" 
                 style="border-radius: 12px; display: block; object-fit: cover;" />
            <div>
              <div style="font-size: 20px; font-weight: 700; margin-bottom: 8px;">${currentMascot.name}</div>
              <div style="font-size: 16px; opacity: 0.9;">${currentMascot.description}</div>
            </div>
          </div>
        </div>
        
        <!-- Introduction & Summary -->
        <div style="background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; border-radius: 12px; margin: 20px 0; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
          <p style="margin: 0 0 25px 0; color: #666; font-size: 15px; line-height: 1.6;">
            Hello Team,<br><br>
            Please find below the Daily Threat Advisory from the Corporate Security Team. This report highlights key cybersecurity threats, vulnerabilities, and risks identified across global landscapes. We aim to keep you informed and prepared by providing timely insights into emerging security challenges.
          </p>
          <div style="background: linear-gradient(135deg, #f8f9fa, #ffffff); padding: 25px; border-left: 5px solid #FF6F00; border-radius: 8px; margin-bottom: 0; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h3 style="margin: 0 0 15px 0; color: #512DA8; font-size: 20px; font-weight: 700;">
              Overall Summary
            </h3>
            <p style="margin: 0; color: #444; font-size: 16px; line-height: 1.6; white-space: pre-line;">${overallSummary}</p>
          </div>
        </div>
      </div>
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
        return `${styles[severity as keyof typeof styles] || styles.informational} padding: 8px 20px; border-radius: 25px; font-size: 14px; font-weight: 700; display: inline-block; text-transform: uppercase; letter-spacing: 0.5px;`;
      };
      
      const getSeverityColor = (severity: string) => {
        const colors = {
          critical: '#D32F2F',
          high: '#F57C00', 
          medium: '#FBC02D',
          low: '#1976D2',
          informational: '#9E9E9E'
        };
        return colors[severity as keyof typeof colors] || colors.informational;
      };
      
      return `
        <div style="max-width: 900px; margin: 0 auto 40px auto; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
          <div style="background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
            <div style="margin-bottom: 25px; display: flex; justify-content: space-between; align-items: flex-start;">
              <h2 style="margin: 0; color: #FF6F00; font-size: 24px; font-weight: 700; flex: 1;">${advisory.name}</h2>
              <span style="${getSeverityStyle(advisory.severity)}">${advisory.severity}</span>
            </div>
            
          ${advisory.attackType ? `<div style="padding: 20px 0; border-bottom: 1px solid #f5f5f5;"><h3 style="margin: 0 0 12px 0; color: #512DA8; font-size: 18px; font-weight: 600;">Attack Type</h3><p style="margin: 0; color: #555; line-height: 1.6; font-size: 16px;">${advisory.attackType}</p></div>` : ''}
            
            ${advisory.vulnerability ? `<div style="padding: 20px 0; border-bottom: 1px solid #f5f5f5;"><h3 style="margin: 0 0 12px 0; color: #512DA8; font-size: 18px; font-weight: 600;">Vulnerability</h3><p style="margin: 0; color: #555; line-height: 1.6; font-size: 16px;">${advisory.vulnerability}</p></div>` : ''}
            
            ${advisory.summary ? `<div style="padding: 20px 0; border-bottom: 1px solid #f5f5f5;"><h3 style="margin: 0 0 12px 0; color: #512DA8; font-size: 18px; font-weight: 600;">Summary</h3><p style="margin: 0; color: #555; line-height: 1.6; font-size: 16px;">${advisory.summary}${advisory.readMoreLink ? ` <a href="${advisory.readMoreLink}" style="color: #FF6F00; text-decoration: none; font-weight: 600;">Read more...</a>` : ''}</p></div>` : ''}
            
            ${advisory.threatActor || advisory.deliveryMethod ? `<div style="padding: 20px 0; border-bottom: 1px solid #f5f5f5; display: grid; grid-template-columns: 1fr 1fr; gap: 30px;">
              ${advisory.threatActor ? `<div><h3 style="margin: 0 0 12px 0; color: #512DA8; font-size: 18px; font-weight: 600;">Threat Actor</h3><p style="margin: 0; color: #555; line-height: 1.6; font-size: 16px;">${advisory.threatActor}</p></div>` : ''}
              ${advisory.deliveryMethod ? `<div><h3 style="margin: 0 0 12px 0; color: #512DA8; font-size: 18px; font-weight: 600;">Delivery Method</h3><p style="margin: 0; color: #555; line-height: 1.6; font-size: 16px;">${advisory.deliveryMethod}</p></div>` : ''}
            </div>` : ''}
            
            ${advisory.mitigation ? `<div style="padding: 20px 0; border-bottom: 1px solid #f5f5f5;"><h3 style="margin: 0 0 12px 0; color: #512DA8; font-size: 18px; font-weight: 600;">Recommended Actions</h3><p style="margin: 0; color: #555; line-height: 1.6; font-size: 16px;">${advisory.mitigation}</p></div>` : ''}
            
            ${advisory.references && advisory.references.length > 0 ? `<div style="padding: 20px 0;"><h3 style="margin: 0 0 12px 0; color: #512DA8; font-size: 18px; font-weight: 600;">References</h3><ul style="margin: 0; padding-left: 25px; color: #555; font-size: 16px;">${advisory.references.map(ref => `<li style="margin-bottom: 8px;"><a href="${ref}" style="color: #FF6F00; text-decoration: none; font-weight: 500;">${ref}</a></li>`).join('')}</ul></div>` : ''}
          </div>
        </div>
      `;
    });
    const footer = `
      <div style="max-width: 900px; margin: 0 auto; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
        <div style="background: #f8f9fa; padding: 30px; border: 1px solid #e0e0e0; border-radius: 12px; margin: 20px 0; box-shadow: 0 4px 20px rgba(0,0,0,0.08); text-align: center;">
          <p style="margin: 0 0 20px 0; color: #666; font-size: 14px; font-style: italic; line-height: 1.6;">
            This is an internal LTIMindtree Threat Intel Advisory Do not share externally<br>
            IoCs are being tracked in the GSOC excel sheet
          </p>
          <p style="margin: 0 0 20px 0; color: #512DA8; font-size: 16px; font-weight: 600;">
            Regards<br>Corporate Security Team
          </p>
          <div style="background: linear-gradient(135deg, #512DA8, #6A42C2); color: white; padding: 15px 25px; border-radius: 8px; font-size: 16px; font-weight: 600; display: inline-block;">
            ${currentMascot.name} • <span>${currentMascot.tagline}</span>
          </div>
        </div>
      </div>
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
  const exportAsPDF = async () => {
    if (advisories.length === 0) {
      toast({
        variant: "destructive",
        title: "No Content",
        description: "Generate preview first before exporting PDF."
      });
      return;
    }
    try {
      setIsExporting(true);
      toast({
        title: "Generating PDF",
        description: "Please wait while we prepare your PDF..."
      });

      // Create a temporary div with the content
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = await generateEmailHTML();
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      tempDiv.style.top = '-9999px';
      tempDiv.style.background = '#ffffff';
      tempDiv.style.width = '900px';
      tempDiv.style.padding = '20px';
      tempDiv.style.fontFamily = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
      tempDiv.style.fontSize = '14px';
      tempDiv.style.lineHeight = '1.6';
      document.body.appendChild(tempDiv);
      const canvas = await html2canvas(tempDiv, {
        width: 940,
        height: tempDiv.scrollHeight + 40,
        backgroundColor: '#ffffff',
        scale: 1.5,
        useCORS: true,
        allowTaint: true
      });
      document.body.removeChild(tempDiv);
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pdfWidth - 20; // 10mm margin on each side
      const imgHeight = canvas.height * imgWidth / canvas.width;
      let heightLeft = imgHeight;
      let position = 10; // 10mm top margin

      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight - 20; // Account for margins

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight + 10;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight - 20;
      }

      // Add footer with attribution
      const totalPages = pdf.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        pdf.setFontSize(10);
        pdf.setTextColor(128, 128, 128);
        pdf.text('Exported from ThreatNote — built with ❤ by Amrit Sinha', pdfWidth / 2, pdfHeight - 10, {
          align: 'center'
        });
      }
      pdf.save(`threatnote-advisory-${new Date().toISOString().split('T')[0]}.pdf`);
      toast({
        title: "PDF Exported",
        description: "Advisory PDF file exported successfully."
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Export Failed",
        description: "Failed to export PDF file."
      });
    } finally {
      setIsExporting(false);
    }
  };
  if (advisories.length === 0) return null;
  return <div className="fixed bottom-6 right-6 z-50">
      <Button 
        onClick={downloadHTML} 
        disabled={isExporting} 
        size="icon" 
        className="btn-ltim-accent shadow-lg h-12 w-12"
        title="Export HTML"
      >
        <FileText className="w-5 h-5" />
      </Button>
    </div>;
}