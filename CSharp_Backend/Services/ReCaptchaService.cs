using System.Text.Json;
using Microsoft.Extensions.Configuration;

namespace GymApi.Services
{
    public class ReCaptchaService
    {
        private readonly string _secretKey;
        private readonly HttpClient _httpClient;

        public ReCaptchaService(HttpClient httpClient, IConfiguration configuration)
        {
            _httpClient = httpClient;
            _secretKey = configuration["ReCaptcha:SecretKey"] ?? Environment.GetEnvironmentVariable("RECAPTCHA_SECRET");
        }

        public async Task<bool> VerifyToken(string token)
        {
            try
            {
                Console.WriteLine("🔐 [Backend] Verificando token de reCAPTCHA v2...");

                var requestBody = $"secret={_secretKey}&response={token}";
                var content = new StringContent(requestBody, System.Text.Encoding.UTF8, "application/x-www-form-urlencoded");

                var response = await _httpClient.PostAsync("https://www.google.com/recaptcha/api/siteverify", content);
                var responseContent = await response.Content.ReadAsStringAsync();

                using (JsonDocument doc = JsonDocument.Parse(responseContent))
                {
                    var root = doc.RootElement;
                    bool success = root.GetProperty("success").GetBoolean();

                    Console.WriteLine($"📡 [Backend] Respuesta de Google reCAPTCHA v2: success={success}");

                    if (success)
                    {
                        Console.WriteLine("✅ [Backend] Verificación de Captcha v2 exitosa");
                        return true;
                    }
                    else
                    {
                        Console.WriteLine("❌ [Backend] Verificación fallida");
                        return false;
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ [Backend] Error al verificar Captcha: {ex.Message}");
                return false;
            }
        }
    }
}
