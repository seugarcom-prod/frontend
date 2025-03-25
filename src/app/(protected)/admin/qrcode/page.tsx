// páginas/admin/qrcodes.tsx
'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, Printer } from 'lucide-react';
import { QRCodeCanvas, QRCodeSVG } from 'qrcode.react';

export default function QRCodeGenerator() {
    const [restaurantId, setRestaurantId] = useState('67da283ca39b629d7b2bf317');
    const [numTables, setNumTables] = useState(1);
    const [baseDomain, setBaseDomain] = useState('https://seudominio.com');
    const [qrCodes, setQrCodes] = useState<string[]>([]);
    const [qrSize, setQrSize] = useState(200);

    // Gerar QR Codes para todas as mesas
    const generateQRCodes = () => {
        const codes = [];
        for (let i = 1; i <= numTables; i++) {
            codes.push(`${baseDomain}/qrcode/${restaurantId}/${i}`);
        }
        setQrCodes(codes);
    };

    // Função para baixar QR Code individual
    const downloadQRCode = (url: string, tableNumber: number) => {
        const canvas = document.getElementById(`qr-${tableNumber}`) as HTMLCanvasElement;
        if (canvas) {
            const pngUrl = canvas
                .toDataURL('image/png')
                .replace('image/png', 'image/octet-stream');

            const downloadLink = document.createElement('a');
            downloadLink.href = pngUrl;
            downloadLink.download = `qrcode-mesa-${tableNumber}.png`;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        }
    };

    // Função para imprimir todos os QR codes
    const printAllQRCodes = () => {
        const printWindow = window.open('', '_blank');
        if (!printWindow) return;

        const restaurantName = 'Seu Restaurante'; // Substituir pelo nome real

        printWindow.document.write(`
      <html>
        <head>
          <title>QR Codes - ${restaurantName}</title>
          <style>
            body { font-family: Arial, sans-serif; }
            .qr-wrapper { 
              display: inline-block; 
              margin: 10px; 
              text-align: center;
              page-break-inside: avoid;
              border: 1px solid #ccc;
              padding: 15px;
              border-radius: 8px;
            }
            .restaurant-name { 
              font-weight: bold; 
              margin-bottom: 5px;
              font-size: 14px;
            }
            .table-number { 
              font-size: 18px;
              font-weight: bold;
              margin: 10px 0;
            }
            .instructions {
              font-size: 12px;
              color: #666;
              margin-top: 10px;
            }
            @media print {
              .qr-wrapper {
                width: 45%;
                margin: 10px auto;
              }
            }
          </style>
        </head>
        <body>
          <div style="text-align: center; margin-bottom: 20px;">
            <h1>${restaurantName} - QR Codes</h1>
            <button onclick="window.print()">Imprimir QR Codes</button>
          </div>
          <div>
    `);

        qrCodes.forEach((url, index) => {
            const tableNumber = index + 1;
            printWindow.document.write(`
        <div class="qr-wrapper">
          <div class="restaurant-name">${restaurantName}</div>
          <div class="table-number">Mesa ${tableNumber}</div>
          <img src="${(document.getElementById(`qr-${tableNumber}`) as HTMLCanvasElement)?.toDataURL()}" width="${qrSize}" height="${qrSize}" />
          <div class="instructions">Escaneie o QR Code para fazer seu pedido</div>
        </div>
      `);
        });

        printWindow.document.write(`
          </div>
        </body>
      </html>
    `);

        printWindow.document.close();
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Gerador de QR Codes para Mesas</h1>

            <Card className="mb-6">
                <CardContent className="p-6">
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="restaurantId">ID do Restaurante</Label>
                            <Input
                                id="restaurantId"
                                value={restaurantId}
                                onChange={(e) => setRestaurantId(e.target.value)}
                                placeholder="ID do restaurante"
                            />
                        </div>

                        <div>
                            <Label htmlFor="numTables">Número de Mesas</Label>
                            <Input
                                id="numTables"
                                type="number"
                                min="1"
                                value={numTables}
                                onChange={(e) => setNumTables(parseInt(e.target.value) || 1)}
                            />
                        </div>

                        <div>
                            <Label htmlFor="baseDomain">Domínio Base</Label>
                            <Input
                                id="baseDomain"
                                value={baseDomain}
                                onChange={(e) => setBaseDomain(e.target.value)}
                                placeholder="https://seusite.com"
                            />
                        </div>

                        <div>
                            <Label htmlFor="qrSize">Tamanho do QR Code</Label>
                            <Select value={qrSize.toString()} onValueChange={(value) => setQrSize(parseInt(value))}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione o tamanho" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="150">Pequeno (150px)</SelectItem>
                                    <SelectItem value="200">Médio (200px)</SelectItem>
                                    <SelectItem value="250">Grande (250px)</SelectItem>
                                    <SelectItem value="300">Muito Grande (300px)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <Button onClick={generateQRCodes} className="w-full">
                            Gerar QR Codes
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {qrCodes.length > 0 && (
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">QR Codes Gerados</h2>
                        <Button onClick={printAllQRCodes} variant="outline">
                            <Printer className="mr-2 h-4 w-4" />
                            Imprimir Todos
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {qrCodes.map((url, index) => {
                            const tableNumber = index + 1;
                            return (
                                <Card key={tableNumber} className="overflow-hidden">
                                    <CardContent className="p-4 text-center">
                                        <h3 className="font-bold text-lg mb-2">Mesa {tableNumber}</h3>
                                        <div className="flex justify-center mb-4">
                                            <QRCodeSVG
                                                id={`qr-${tableNumber}`}
                                                value={url}
                                                size={qrSize}
                                                level="H"
                                            />
                                        </div>
                                        <div className="flex justify-center">
                                            <Button
                                                onClick={() => downloadQRCode(url, tableNumber)}
                                                variant="outline"
                                                size="sm"
                                            >
                                                <Download className="mr-2 h-4 w-4" />
                                                Baixar
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}