using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using DAL.DTO.Req;
using Microsoft.AspNetCore.Mvc;
using PeerLandingFE.DTO.Req;
using PeerLandingFE.DTO.Res;

namespace PeerLandingFE.Controllers.api
{
    public class ApiMothlyPaymentController : Controller
    {
        private readonly HttpClient _httpClient;

        public ApiMothlyPaymentController(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        [HttpGet]
        public async Task<IActionResult> GetMonthlyPaymentByRepaymentId(string repaymentId)
        {
            var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            var response = await _httpClient.GetAsync($"https://localhost:7240/rest/v1/monthlyPayment?repaymentId={repaymentId}");

            if (response.IsSuccessStatusCode)
            {
                var responseData = await response.Content.ReadAsStringAsync();
                return Ok(responseData);
            }
            else
            {
                return BadRequest("Get payment failed!");
            }
        }

        [HttpPost]
        public async Task<IActionResult> PayMonthlyPayment([FromBody] List<ReqPayMonthlyPaymentDto> paymentRequests)
        {
            try
            {
                Console.WriteLine("tes");
                Console.WriteLine(paymentRequests);
                var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
                _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

                var json = JsonSerializer.Serialize(paymentRequests);
                var content = new StringContent(json, Encoding.UTF8, "application/json");
                var response = await _httpClient.PostAsync($"https://localhost:7240/rest/v1/monthlyPayment/pay", content);
                Console.WriteLine(content);
                Console.WriteLine(response);

                if (response.IsSuccessStatusCode)
                {
                    var responseData = await response.Content.ReadAsStringAsync();
                    return Ok(responseData);
                }
                else
                {
                    var errorContent = await response.Content.ReadAsStringAsync();
                    return BadRequest($"Payment failed with status code {response.StatusCode}: {errorContent}");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}
