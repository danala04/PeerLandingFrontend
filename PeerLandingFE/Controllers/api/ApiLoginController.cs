using System.Text;
using System.Text.Json;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;

namespace PeerLandingFE.Controllers.api
{
    public class ApiLoginController : Controller
    {
        private readonly HttpClient _httpClient;

        public ApiLoginController(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        [HttpPost]
        public async Task<IActionResult> Login([FromBody] LoginRequest loginRequest)
        {
            var json = JsonSerializer.Serialize(loginRequest);
            var content = new StringContent(json, Encoding.UTF8, "application/json");
            var response = await _httpClient.PostAsync("https://localhost:7240/rest/v1/user/Login", content);

            var responseData = await response.Content.ReadAsStringAsync();
            if (response.IsSuccessStatusCode)
            {
                return Ok(JsonDocument.Parse(responseData).RootElement);
            }
            else
            {
                return BadRequest(JsonDocument.Parse(responseData).RootElement);
            }
        }
    }
}
