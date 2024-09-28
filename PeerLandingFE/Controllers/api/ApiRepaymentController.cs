using System.Net.Http.Headers;
using Microsoft.AspNetCore.Mvc;

namespace PeerLandingFE.Controllers.api
{
    public class ApiRepaymentController : Controller
    {
        private readonly HttpClient _httpClient;

        public ApiRepaymentController(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        [HttpGet]
        public async Task<IActionResult> GetRepaymentDetailByLoanId(string loanId)
        {
            var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            var response = await _httpClient.GetAsync($"https://localhost:7240/rest/v1/repayment/{loanId}");

            if (response.IsSuccessStatusCode)
            {
                var responseData = await response.Content.ReadAsStringAsync();
                return Ok(responseData);
            }
            else
            {
                return BadRequest("Get repayment detail failed!");
            }
        }
    }
}
