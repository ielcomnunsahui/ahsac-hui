import { QRCodeSVG } from "qrcode.react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, QrCode } from "lucide-react";

interface MemberQRCodeProps {
  memberId: string;
  memberName: string;
  matricNumber: string;
}

export const MemberQRCode = ({ memberId, memberName, matricNumber }: MemberQRCodeProps) => {
  const qrData = JSON.stringify({
    type: "ahsac_member",
    id: memberId,
    matric: matricNumber,
  });

  const handleDownload = () => {
    const canvas = document.createElement("canvas");
    const svg = document.querySelector("#member-qr-code svg");
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const img = new Image();
    const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      canvas.width = 300;
      canvas.height = 300;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, 300, 300);
        const pngUrl = canvas.toDataURL("image/png");
        const downloadLink = document.createElement("a");
        downloadLink.href = pngUrl;
        downloadLink.download = `ahsac_qr_${matricNumber}.png`;
        downloadLink.click();
      }
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <QrCode className="h-5 w-5" />
          Your Event Check-in QR Code
        </CardTitle>
        <CardDescription>
          Show this QR code to admins at events for quick check-in
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-4">
        <div 
          id="member-qr-code" 
          className="p-4 bg-white rounded-lg shadow-inner border border-border"
        >
          <QRCodeSVG
            value={qrData}
            size={180}
            level="H"
            includeMargin
            bgColor="#ffffff"
            fgColor="#000000"
          />
        </div>
        <div className="text-center">
          <p className="font-semibold">{memberName}</p>
          <p className="text-sm text-muted-foreground">{matricNumber}</p>
        </div>
        <Button variant="outline" onClick={handleDownload}>
          <Download className="h-4 w-4 mr-2" />
          Download QR Code
        </Button>
      </CardContent>
    </Card>
  );
};
