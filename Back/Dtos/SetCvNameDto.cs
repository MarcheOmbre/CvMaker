using System.ComponentModel.DataAnnotations;

namespace CvBuilderBack.Dtos;

public class SetCvNameDto
{
    public int CvId { get; init; }
    
    [MaxLength(50)]
    public string Name { get; init; } = string.Empty;
}