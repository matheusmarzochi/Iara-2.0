import { conversionRate } from "./researchInteractionsCount";
import { render, screen } from "@testing-library/react";
import ResearchInteractionsCount from "./researchInteractionsCount";
import "@testing-library/jest-dom";

describe("conversionRate", () => {
  it("returns 0 when both formsLength and totalViews are 0", () => {
    expect(conversionRate(0, 0)).toBe(0);
  });

  it("returns 100 when formsLength > totalViews", () => {
    expect(conversionRate(10, 5)).toBe(100);
  });

  it("returns correct rounded percentage", () => {
    expect(conversionRate(5, 10)).toBe(50);
    expect(conversionRate(3, 8)).toBe(38);
  });

  it("never returns more than 100", () => {
    expect(conversionRate(200, 100)).toBe(100);
  });

  it("returns 0 if formsLength is 0 and totalViews > 0", () => {
    expect(conversionRate(0, 10)).toBe(0);
  });
});

describe("ResearchInteractionsCount component", () => {
  it("renders the correct values for views, forms, and conversion rate", () => {
    render(<ResearchInteractionsCount totalViews={20} formsLength={5} />);
    expect(screen.getByTitle("Número de visualizações únicas desta pesquisa")).toHaveTextContent("20");
    expect(screen.getByTitle("Número de respostas recebidas")).toHaveTextContent("5");
    expect(screen.getByTitle("Porcentagem de Conversão")).toHaveTextContent("(25%)");
  });

  it("renders 0% conversion when both values are 0", () => {
    render(<ResearchInteractionsCount totalViews={0} formsLength={0} />);
    expect(screen.getByTitle("Porcentagem de Conversão")).toHaveTextContent("(0%)");
  });

  it("renders 100% conversion when formsLength > totalViews", () => {
    render(<ResearchInteractionsCount totalViews={2} formsLength={5} />);
    expect(screen.getByTitle("Porcentagem de Conversão")).toHaveTextContent("(100%)");
  });

  it("renders 0% conversion when formsLength is 0 and totalViews > 0", () => {
    render(<ResearchInteractionsCount totalViews={10} formsLength={0} />);
    expect(screen.getByTitle("Porcentagem de Conversão")).toHaveTextContent("(0%)");
  });
});
