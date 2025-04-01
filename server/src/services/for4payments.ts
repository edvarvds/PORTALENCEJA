interface PaymentResponse {
  id: string;
  pixCode: string;
  pixQrCode: string;
  expiresAt: string;
  status: string;
}

interface PaymentData {
  amount: number;
  name: string;
  email: string;
  cpf: string;
  phone: string;
  productName: string;
}

export class For4PaymentsAPI {
  private API_URL = "https://app.for4payments.com.br/api/v1";
  private secretKey: string;

  constructor(secretKey: string) {
    if (!secretKey) {
      throw new Error("FOR4PAYMENTS_SECRET_KEY não está configurada");
    }
    this.secretKey = secretKey.trim();
    console.log("[For4Payments] API inicializada");
    console.log("[For4Payments] Chave API formato:", 
      this.secretKey.substring(0, 4) + "..." + 
      this.secretKey.substring(this.secretKey.length - 4));
  }

  private getHeaders(): Record<string, string> {
    if (!this.secretKey) {
      throw new Error("Chave API não está configurada");
    }

    const headers = {
      'Authorization': this.secretKey,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'User-Agent': 'Portal-ENCCEJA/1.0'
    };

    // Log completo dos headers para debug
    console.log("[For4Payments] Headers completos:", {
      ...headers,
      'Authorization': headers.Authorization.substring(0, 4) + "..." + headers.Authorization.substring(headers.Authorization.length - 4)
    });
    return headers;
  }

  async create_pix_payment(data: PaymentData): Promise<PaymentResponse> {
    try {
      if (!this.secretKey) {
        throw new Error("Chave API não está configurada");
      }

      console.log("\n[For4Payments] ===== Iniciando criação de pagamento PIX =====");
      console.log("[For4Payments] Dados de entrada:", JSON.stringify(data, null, 2));

      const amount = Math.round(data.amount);
      console.log("[For4Payments] Valor a ser enviado:", amount);

      const cleanPhone = data.phone.replace(/\D/g, '');
      console.log("[For4Payments] Telefone original:", data.phone);
      console.log("[For4Payments] Telefone limpo:", cleanPhone);

      const cleanCPF = data.cpf.replace(/\D/g, '');
      console.log("[For4Payments] CPF original:", data.cpf);
      console.log("[For4Payments] CPF limpo:", cleanCPF);

      if (!data.name || !data.email || !cleanCPF || !cleanPhone) {
        console.error("[For4Payments] Erro de validação - campos faltando:");
        console.error("- Nome:", data.name ? "presente" : "faltando");
        console.error("- Email:", data.email ? "presente" : "faltando");
        console.error("- CPF:", cleanCPF ? "presente" : "faltando");
        console.error("- Telefone:", cleanPhone ? "presente" : "faltando");
        throw new Error("Campos obrigatórios faltando");
      }

      if (amount < 100) {
        console.error("[For4Payments] Erro de validação - valor mínimo:");
        console.error("- Valor:", amount);
        console.error("- Valor mínimo necessário:", 100);
        throw new Error("Valor mínimo para pagamento é R$ 1,00");
      }

      const paymentData = {
        name: data.name,
        email: data.email,
        cpf: cleanCPF,
        phone: cleanPhone,
        paymentMethod: "PIX",
        amount: amount,
        currency: "BRL",
        description: "Confirmação Local",
        callbackUrl: `${process.env.PUBLIC_URL || 'http://localhost:5000'}/api/payment/webhook`,
        items: [{
          title: "Confirmação Local",
          quantity: 1,
          unitPrice: amount,
          tangible: false,
          description: "Confirmação Local"
        }],
        metadata: {
          source: "web",
          paymentType: "ipva",
          productName: data.productName,
          cpf: cleanCPF
        }
      };

      console.log("\n[For4Payments] ===== Dados do pagamento preparados =====");
      console.log("[For4Payments] Payload:", JSON.stringify(paymentData, null, 2));

      const response = await fetch(`${this.API_URL}/transaction.purchase`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(paymentData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("\n[For4Payments] ===== Erro na API =====");
        console.error("[For4Payments] Corpo da resposta:", errorText);
        throw new Error(`Erro na API de pagamento: ${errorText}`);
      }

      const responseData = await response.json() as PaymentResponse;
      console.log("\n[For4Payments] ===== Sucesso =====");
      console.log("[For4Payments] Resposta:", JSON.stringify(responseData, null, 2));

      return {
        id: responseData.id,
        pixCode: responseData.pixCode,
        pixQrCode: responseData.pixQrCode,
        expiresAt: responseData.expiresAt,
        status: responseData.status || 'pending'
      };
    } catch (error) {
      console.error("\n[For4Payments] ===== Erro na requisição =====");
      console.error("[For4Payments] Detalhes do erro:", error);
      throw error;
    }
  }

  async check_payment_status(payment_id: string): Promise<{ status: string, pix_qr_code?: string, pix_code?: string }> {
    try {
      const url = new URL(`${this.API_URL}/transaction.getPayment`);
      url.searchParams.append('id', payment_id);

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: this.getHeaders()
      });

      if (response.ok) {
        const payment_data = await response.json() as {
          status: string;
          pixQrCode?: string;
          pixCode?: string;
        };

        const status_mapping: Record<string, string> = {
          'PENDING': 'pending',
          'PROCESSING': 'pending',
          'APPROVED': 'completed',
          'COMPLETED': 'completed',
          'PAID': 'completed',
          'EXPIRED': 'failed',
          'FAILED': 'failed',
          'CANCELED': 'cancelled',
          'CANCELLED': 'cancelled'
        };

        const current_status = payment_data.status || 'PENDING';
        const mapped_status = status_mapping[current_status] || 'pending';

        return {
          status: mapped_status,
          pix_qr_code: payment_data.pixQrCode,
          pix_code: payment_data.pixCode
        };
      } else if (response.status === 404) {
        return { status: 'pending' };
      } else {
        return { status: 'pending' };
      }
    } catch (error) {
      console.error("[For4Payments] Error checking payment status:", error);
      return { status: 'pending' };
    }
  }
} 