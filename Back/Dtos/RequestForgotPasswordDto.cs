namespace CvBuilderBack.Dtos;

public class RequestForgotPasswordDto
{
    public string Email { get; init; } = string.Empty;
    public string PagePath { get; init; } = string.Empty;
}