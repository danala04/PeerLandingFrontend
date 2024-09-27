namespace PeerLandingFE.DTO.Req
{
    public class ReqAddMstUserDto
    {
        public string Name { get; set; }
        public string Email { get; set; }
        public string Password { get; set; } = "Password1";
        public string Role { get; set; }
        public decimal Balance { get; set; } = 0;
    }
}
