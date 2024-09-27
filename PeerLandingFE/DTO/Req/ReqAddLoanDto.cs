namespace PeerLandingFE.DTO.Req
{
    public class ReqAddLoanDto
    {
        public string BorrowerId { get; set; }
        public decimal Amount { get; set; }
        public decimal InterestRate { get; set; }
        public int Duration { get; set; }
    }
}
