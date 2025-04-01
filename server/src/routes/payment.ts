import express from 'express';
import { For4PaymentsAPI } from '../services/for4payments';
import User from '../models/User';

const router = express.Router();

// Verificar se a chave está configurada
const secretKey = process.env.FOR4PAYMENTS_SECRET_KEY;
if (!secretKey) {
  console.error("[Payment] ERRO: FOR4PAYMENTS_SECRET_KEY não está configurada no .env");
}

const paymentAPI = new For4PaymentsAPI(secretKey || '');

// Webhook para receber notificações de pagamento
router.post('/webhook', async (req, res) => {
  try {
    const { id, status, metadata } = req.body;
    console.log('[Webhook] Recebido:', { id, status, metadata });

    if (status === 'APPROVED') {
      const productName = metadata?.productName;
      const cpf = metadata?.cpf;

      if (!cpf) {
        throw new Error('CPF não encontrado nos metadados');
      }

      const user = await User.findOne({ cpf });
      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      // Atualiza o passo completado com base no produto
      if (productName?.includes('Local')) {
        user.stepsCompleted = {
          ...user.stepsCompleted,
          locationConfirmed: true
        };
      } else if (productName?.includes('Material')) {
        user.stepsCompleted = {
          ...user.stepsCompleted,
          studyMaterialsAccessed: true
        };
      }

      await user.save();
      console.log('[Webhook] Usuário atualizado:', user.cpf);
    }

    res.json({ success: true });
  } catch (error) {
    console.error('[Webhook] Erro:', error);
    res.status(500).json({ error: 'Erro ao processar webhook' });
  }
});

router.post('/create-pix', async (req, res) => {
  try {
    if (!secretKey) {
      throw new Error("Chave API não configurada");
    }

    const { amount, name, email, cpf, phone, productName } = req.body;

    const paymentData = {
      amount: parseInt(amount),
      name,
      email,
      cpf,
      phone,
      productName
    };

    const response = await paymentAPI.create_pix_payment(paymentData);
    res.json(response);
  } catch (error) {
    console.error('Payment creation error:', error);
    res.status(500).json({ error: 'Failed to create payment' });
  }
});

router.get('/status/:paymentId', async (req, res) => {
  try {
    const { paymentId } = req.params;
    const status = await paymentAPI.check_payment_status(paymentId);
    res.json(status);
  } catch (error) {
    console.error('Payment status check error:', error);
    res.status(500).json({ error: 'Failed to check payment status' });
  }
});

export default router; 