import axios from 'axios';

export class EmailValidatorService {
  private static readonly API_KEY = '02dae8bb1bd029a20dff5a67b53b7e5f4729a6ee'; // Substitua pela sua chave

  static async isValidGoogleEmail(email: string): Promise<boolean> {
    try {
      const response = await axios.get(
        `https://api.hunter.io/v2/email-verifier?email=${email}&api_key=${this.API_KEY}`,
      );

      // Verifica se o e-mail é válido e pertence ao Google
      return (
        response.data.data.status === 'valid' && email.endsWith('@gmail.com')
      );
    } catch (error) {
      console.error('Erro ao validar o e-mail:', error);
      return false;
    }
  }
}
