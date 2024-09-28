using Microsoft.AspNetCore.Mvc;

namespace PeerLandingFE.DTO.Req
{
    public class ReqAddFundingDto : Controller
    {
        public string loanId { get; set; }
        public string lenderId { get; set; }
    }
}
