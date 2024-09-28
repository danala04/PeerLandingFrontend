using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using PeerLandingFE.DTO.Req;

namespace PeerLandingFE.Controllers.api
{
    public class ApiFundingController : Controller
    {
        private readonly HttpClient _httpClient;

        public ApiFundingController(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        [HttpPost]
        public async Task<IActionResult> AddFunding([FromBody] ReqAddFundingDto reqAdd)
        {
            if (reqAdd == null)
            {
                return BadRequest("Invalid funding data!");
            }

            var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            var json = JsonSerializer.Serialize(reqAdd);
            var content = new StringContent(json, Encoding.UTF8, "application/json");
            var response = await _httpClient.PostAsync($"https://localhost:7240/rest/v1/funding", content);
            Console.WriteLine(response.ToString());

            if (response.IsSuccessStatusCode)
            {
                var responseData = await response.Content.ReadAsStringAsync();
                return Ok(responseData);
            }
            else
            {
                return BadRequest("Failed to add funding");
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetFundingsByLenderId(string id)
        {
            var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            var response = await _httpClient.GetAsync($"https://localhost:7240/rest/v1/funding/{id}");

            if (response.IsSuccessStatusCode)
            {
                var responseData = await response.Content.ReadAsStringAsync();
                return Ok(responseData);
            }
            else
            {
                return BadRequest("Get fundings failed!");
            }
        }
    }
}
