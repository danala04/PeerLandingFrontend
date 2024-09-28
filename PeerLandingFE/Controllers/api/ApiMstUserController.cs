using System.Net.Http.Headers;
using Microsoft.AspNetCore.Identity.Data;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using PeerLandingFE.DTO.Req;
using System.Text.Json;
using PeerLandingFE.DTO.Res;

namespace PeerLandingFE.Controllers.api
{
    public class ApiMstUserController : Controller
    {
        private readonly HttpClient _httpClient;

        public ApiMstUserController(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllUsers()
        {
            var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            var response = await _httpClient.GetAsync("https://localhost:7240/rest/v1/user/GetAllUser");

            if (response.IsSuccessStatusCode)
            {
                var responseData = await response.Content.ReadAsStringAsync();
                return Ok(responseData);
            }
            else
            {
                return BadRequest("Get user failed!");
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetUserById(string id)
        {
            if (string.IsNullOrEmpty(id))
            {
                return BadRequest("User ID cannot be null or empty");
            }

            var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            var response = await _httpClient.GetAsync($"https://localhost:7240/rest/v1/user/GetUserById?userId={id}");

            if (response.IsSuccessStatusCode)
            {
                var responseData = await response.Content.ReadAsStringAsync();
                return Ok(responseData);
            }
            else
            {
                return BadRequest("Failed to fetch user");
            }
        }

        [HttpPut]
        public async Task<IActionResult> UpdateUser(string id, [FromBody] ReqMstUserDto reqMstUserDto)
        {            
            if (reqMstUserDto == null)
            {
                return BadRequest("Invalid user data");
            }

            var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            var json = JsonSerializer.Serialize(reqMstUserDto);
            var content = new StringContent(json, Encoding.UTF8, "application/json");
            var response = await _httpClient.PutAsync($"https://localhost:7240/rest/v1/user/Update/{id}", content);

            if (response.IsSuccessStatusCode)
            {
                var responseData = await response.Content.ReadAsStringAsync();
                return Ok(responseData);
            }
            else
            {
                return BadRequest("Failed to update user");
            }
        }

        [HttpDelete]
        public async Task<IActionResult> DeleteUser(string id)
        {
            if (string.IsNullOrEmpty(id))
            {
                return BadRequest("User ID cannot be null or empty");
            }

            var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            var response = await _httpClient.DeleteAsync($"https://localhost:7240/rest/v1/user/DeleteUser/{id}");

            if (response.IsSuccessStatusCode)
            {
                var responseData = await response.Content.ReadAsStringAsync();
                return Ok(responseData);
            }
            else
            {
                return BadRequest("Failed to delete user");
            }
        }

        [HttpPost]
        public async Task<IActionResult> AddUser([FromBody] ReqAddMstUserDto reqAdd)
        {
            Console.WriteLine(reqAdd);
            if (reqAdd == null)
            {
                return BadRequest("Invalid user data");
            }

            var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            var json = JsonSerializer.Serialize(reqAdd);
            var content = new StringContent(json, Encoding.UTF8, "application/json");
            var response = await _httpClient.PostAsync($"https://localhost:7240/rest/v1/user/AddUser", content);

            if (response.IsSuccessStatusCode)
            {
                var responseData = await response.Content.ReadAsStringAsync();
                return Ok(responseData);
            }
            else
            {
                return BadRequest("Failed to add user");
            }
        }
    }
}
